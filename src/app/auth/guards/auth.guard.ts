import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Jwt token is missing');
    }

    return this.authService
      .verifyToken(authorization)
      .then((user) => {
        this.logger.log('Jwt token is valid');
        request.user = user;
        return true;
      })
      .catch(() => {
        throw new UnauthorizedException('Jwt token is invalid');
      });
  }
}
