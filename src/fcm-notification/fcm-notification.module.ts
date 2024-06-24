import { Module } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';
import { FcmNotificationController } from './fcm-notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmNotificationEntity } from './entities/fcm-notification.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FcmNotificationEntity]),
    JwtModule,
    UserModule,
  ],
  controllers: [FcmNotificationController],
  providers: [FcmNotificationService],
  exports: [FcmNotificationService],
})
export class FcmNotificationModule {}
