import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // const token = request.body.token;
    const [_, token] = request.headers.authorization?.split(' ') ?? [];

    const secretKey = this.configService.get('JWT_SECRET');

    if (!token) {
      throw new HttpException('token not found', HttpStatus.NOT_FOUND);
    }

    try {
      const user = this.jwtService.verify(token, { secret: secretKey });

      const userData = await this.userService.findById(user.id);

      request.user = userData;
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
