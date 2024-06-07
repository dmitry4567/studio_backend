import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './config/postgres.config';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StudioSessionsModule } from './studio_sessions/studio_sessions.module';
import { TokenModule } from './token/token.module';
import { TypeOfActivityModule } from './type_of_activity/type_of_activity.module';
import { FcmNotificationModule } from './fcm-notification/fcm-notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPostgresConfig,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    StudioSessionsModule,
    TokenModule,
    TypeOfActivityModule,
    FcmNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
