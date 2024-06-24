import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UserEnitity } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './entities/token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(userData: UserEnitity) {
    const access_token = this.jwtService.sign(
      {
        id: userData.id,
        role: userData.role,
      },
      {
        expiresIn: '5s',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        id: userData.id,
        role: userData.role,
      },
      {
        expiresIn: '30d',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return {
      refresh_token,
      access_token,
    };
  }

  async saveToken(user: UserEnitity, refresh_token: string) {
    const tokenData = await this.tokenRepository.findOneBy({ user: user });

    if (tokenData) {
      tokenData.refresh_token = refresh_token;
      await this.tokenRepository.save(tokenData);
      return refresh_token;
    }

    const token = await this.tokenRepository.create({
      user: user,
      refresh_token,
    });

    await this.tokenRepository.save(token);

    return token;
  }

  async validateToken(refresh_token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const userData = this.jwtService.verify(refresh_token, {
        secret,
      });

      return userData;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async deleteToken(user: UserEnitity) {
    return await this.tokenRepository.delete({ user: user });
  }

  async removeToken(refresh_token: string) {
    return await this.tokenRepository.delete({ refresh_token: refresh_token });
  }

  async findToken(refresh_token: string) {
    return await this.tokenRepository.findOneBy({ refresh_token });
  }
}
