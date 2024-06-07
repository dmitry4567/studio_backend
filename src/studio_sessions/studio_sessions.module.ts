import { Module } from '@nestjs/common';
import { StudioSessionsService } from './studio_sessions.service';
import { StudioSessionsController } from './studio_sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioSessionEntity } from './entities/studio_session.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOfActivityModule } from 'src/type_of_activity/type_of_activity.module';
import { FcmNotificationModule } from 'src/fcm-notification/fcm-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudioSessionEntity]),
    UserModule,
    TypeOfActivityModule,
    JwtModule,
    FcmNotificationModule,
  ],
  controllers: [StudioSessionsController],
  providers: [StudioSessionsService],
})
export class StudioSessionsModule {}
