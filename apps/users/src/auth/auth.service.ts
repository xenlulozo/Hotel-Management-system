import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Password } from '../common/utils.password.common';
import { OauthClientDetailEntity } from './entity/oauth-client-detail.entity';
import { OauthAccessTokenEntity } from './entity/oauth-access-token.entity';
import { jwtConstants } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { TokenData } from '../common/interface/toeken.interface';
import axios from 'axios';
import { AUTH_PLATFORM } from '../common/enum/auth.enum';
import { platform } from 'os';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    if (!(await Password.comparePassword(pass, user.password))) throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);

    const payload = { user_id: user.id, email: user.email, platform: AUTH_PLATFORM.NORMAL };
    const { refreshToken, accessToken, accessTokenExpires } = await this.generateJWTToken(payload, 'UPDATE');

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpires: accessTokenExpires
    };
  }

  async signInWithGoogle(email: string, token: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return await this.usersService.signUpWithGoogle(email);
    }
    try {
      await axios.get(process.env.API_GOOGLE_INFO + `?access_token=${token}`);
    } catch (error) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const payload = { user_id: user.id, email: user.email, platform: AUTH_PLATFORM.GOOGLE };
    const { refreshToken, accessToken, accessTokenExpires } = await this.generateJWTToken(payload, 'UPDATE');

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpires: accessTokenExpires
    };
  }

  async generateJWTToken(
    payload: { user_id: number; email: string; platform: AUTH_PLATFORM; password?: string },
    state: 'INSERT' | 'UPDATE',
    entityManager?: EntityManager
  ) {
    const OauthAccessTokenRepository = entityManager
      ? entityManager.getRepository(OauthAccessTokenEntity)
      : this.dataSource.getRepository(OauthAccessTokenEntity);

    const { refreshToken, accessToken } = await this.syncToken({
      user_id: payload.user_id,
      email: payload.email
    });
    const accessTokenExpires = jwtConstants.expiresInValue;

    if (state == 'INSERT')
      await OauthAccessTokenRepository.insert(
        OauthAccessTokenRepository.create({
          user_id: payload.user_id,
          token: accessToken,
          refresh_token: refreshToken,
          platform: payload.platform
        })
      );
    else {
      await OauthAccessTokenRepository.update(
        {
          user_id: payload.user_id
        },
        {
          token: accessToken,
          refresh_token: refreshToken
        }
      );
    }
    return { accessToken, refreshToken, accessTokenExpires };
  }

  async generateBasicAuth(payload: { user_id: number; email: string; password: string }, entityManager: EntityManager) {
    const OauthClientRepository = entityManager.getRepository(OauthClientDetailEntity);

    await OauthClientRepository.save(
      OauthClientRepository.create({
        client_id: payload.user_id,
        client_secret: Buffer.from(JSON.stringify(payload.email + payload.password)).toString('base64')
      })
    );
  }

  async validateToken(data: { accessToken: string; refreshToken: string }) {
    try {
      const payload = await this.jwtService.verifyAsync(data.accessToken);
      console.log(new Date(payload.exp).getTime() - Math.floor(Date.now() / 1000), +jwtConstants.timeAutoRefresh);

      if (new Date(payload.exp).getTime() - Math.floor(Date.now() / 1000) >= +jwtConstants.timeAutoRefresh)
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpires: payload.exp,
          isRefresh: 0
        };
      //REFRESH TOKEN
      console.log('REFRESH TOKEN ');

      const { refreshToken, accessToken, accessTokenExpires } = await this.generateJWTToken(payload, 'UPDATE');

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpires: accessTokenExpires,
        isRefresh: 1
      };
    } catch (error) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(email: string) {}

  async syncToken(payload: any): Promise<TokenData> {
    return {
      accessToken: await this.jwtService.sign(payload, { expiresIn: jwtConstants.expiresIn }),
      refreshToken: await this.jwtService.sign(payload, { expiresIn: jwtConstants.refreshExpiresIn })
    };
  }
}
