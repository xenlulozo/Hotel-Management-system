import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Password } from '../common/utils.password.common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AUTH_PLATFORM } from '../common/enum/auth.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}
  async findOne(email: string) {
    return await this.dataSource.getRepository(UserEntity).findOneBy({
      email: email
    });
  }

  async signUp(body) {
    const hashPassword: string = await Password.bcryptPassword(body.password);

    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const userRepository = entityManager.getRepository(UserEntity);

      const validateEmail: boolean = await userRepository.existsBy({
        email: body.email
      });

      if (validateEmail) throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);

      const user = await userRepository.save(
        userRepository.create({
          email: body.email,
          password: hashPassword
        })
      );
      const payload = {
        user_id: user.id,
        email: body.email,
        password: body.password
      };
      // Basic auth: not recommend
      await this.authService.generateBasicAuth(payload, entityManager);

      //JWT token:
      await this.authService.generateJWTToken(payload, 'INSERT', entityManager);
    });
  }

  async signUpWithGoogle(email: string) {
    let response: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpires: number;
    };
    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const userRepository = entityManager.getRepository(UserEntity);

      const user = await userRepository.save(
        userRepository.create({
          email: email
        })
      );
      const payload = {
        user_id: user.id,
        email: email,
        platform: AUTH_PLATFORM.GOOGLE
      };

      //JWT token:
      response = await this.authService.generateJWTToken(payload, 'INSERT', entityManager);
    });
    return response;
  }
}
