import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';

config();
export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME,
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_TIME,
  expiresInValue: new Date().getTime() + 24 * 60 * 60 * 1000,
  timeAutoRefresh: process.env.TIME_AUTO_REFRESH
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(generateToken): Promise<any> {}
}
