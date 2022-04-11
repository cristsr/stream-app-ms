import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'app/auth/decorators';
import { AuthService } from 'app/auth/services';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const payload = await this.authService
      .verifyToken(authorization)
      .catch((e) => {
        this.logger.error('Jwt token is invalid: ' + e.message);
        throw new UnauthorizedException('Jwt token is invalid');
      });

    const user = await this.authService.profile(payload.sub);

    this.logger.log('Jwt token is valid', payload);

    request.user = user;

    return true;
  }
}
