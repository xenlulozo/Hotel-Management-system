import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

//**use ENV */
export const jwtConstants = {
  secret: 'ENV',
  expiresIn: '10m'
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '940961391059-sj17foe27o4cbnsnfvmecdkmidin9stp.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/user/google/redirect',
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    };
    done(null, user);
  }
}
