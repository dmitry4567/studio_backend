import { Module } from '@nestjs/common';
import { StudioSessionsService } from './studio_sessions.service';
import { StudioSessionsController } from './studio_sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudioSessionEntity } from './entities/studio_session.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([StudioSessionEntity]), UserModule],
  controllers: [StudioSessionsController],
  providers: [StudioSessionsService],
})
export class StudioSessionsModule {}
