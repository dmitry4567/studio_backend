import { Module } from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';
import { FcmNotificationController } from './fcm-notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmNotificationEntity } from './entities/fcm-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FcmNotificationEntity]), JwtModule],
  controllers: [FcmNotificationController],
  providers: [FcmNotificationService],
  exports: [FcmNotificationService],
})
export class FcmNotificationModule {}
