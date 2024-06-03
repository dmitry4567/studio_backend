import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    LocalStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService, JwtModule, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
