import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entities/user.entity';
import { OauthClientDetailEntity } from './auth/entity/oauth-client-detail.entity';
import { OauthAccessTokenEntity } from './auth/entity/oauth-access-token.entity';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'apps/wrapper-controller/src/exception/http.exception';
import { GoogleStrategy } from './auth/strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'write',
      entities: [UserEntity, OauthClientDetailEntity, OauthAccessTokenEntity],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [
    AppService

    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // }
  ]
})
export class AppModule {}
