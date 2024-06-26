import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRole) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      const token = req.body.token;
      const secretKey = this.configService.get('JWT_SECRET');

      if (!token) {
        throw new HttpException('token not found', HttpStatus.NOT_FOUND);
      }

      const user = this.jwtService.verify(token, { secret: secretKey });

      req.user = user;

      if (user.role.value) {
        return user.role.value === requiredRole;
      } else {
        return false;
      }
    } catch (e) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
