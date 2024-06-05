import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private tokenService: TokenService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Пользователя с таким email нет');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Неверный логин или пароль');

    await this.tokenService.deleteToken(user);

    const tokens = await this.tokenService.generateToken({ ...user });
    await this.tokenService.saveToken(user, tokens.refresh_token);

    return tokens;
  }

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    const tokens = await this.tokenService.generateToken(user);
    await this.tokenService.saveToken(user, tokens.refresh_token);

    return tokens;
  }

  async refresh(dto: RefreshTokenDto) {
    const userData = await this.tokenService.validateToken(dto.refresh_token);

    const tokenFromDb = await this.tokenService.findToken(dto.refresh_token);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(userData.id);

    await this.tokenService.deleteToken(user);

    const tokens = await this.tokenService.generateToken({ ...user });
    await this.tokenService.saveToken(user, tokens.refresh_token);

    return tokens;
  }

  async logout(dto: RefreshTokenDto) {
    return await this.tokenService.removeToken(dto.refresh_token);
  }
}
