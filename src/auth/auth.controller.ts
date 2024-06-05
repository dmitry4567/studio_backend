import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth-guards';
import { AuthGuard } from '@nestjs/passport';
import { retry } from 'rxjs';
import { RefreshTokenDto } from 'src/user/dto/refresh-token-dto';
import { LoginUserDto } from 'src/user/dto/login-user-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    return req.user;
  }

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('/refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('Initiating Google Auth');
    // Инициирует процесс аутентификации через Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    console.log('Google Auth Callback');
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}
