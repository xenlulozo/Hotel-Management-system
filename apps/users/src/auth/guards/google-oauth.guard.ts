import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyCallback } from 'passport-google-oauth2';
import { UserEntity } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
    super({
      clientID: 'configService.google.clientID',
      clientSecret: 'configService.google.clientSecret',
      callbackURL: 'configService.google.callbackURL',
      scope: ['profile', 'email']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value
    };

    done(null, user);
  }
}
