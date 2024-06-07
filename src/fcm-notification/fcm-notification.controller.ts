import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { FcmNotificationService } from './fcm-notification.service';
import { CreateFcmNotificationDto } from './dto/create-fcm-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class FcmNotificationController {
  constructor(private readonly fcmTokenService: FcmNotificationService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('subscribe')
  async addNotification(
    @Request() req: any,
    @Body() dto: CreateFcmNotificationDto,
  ) {
    return await this.fcmTokenService.addNotification(req.user, dto);
  }

  @Get('send')
  async send() {
    return await this.fcmTokenService.sendFirebaseMessages('fsef', 'fsf');
  }
}
