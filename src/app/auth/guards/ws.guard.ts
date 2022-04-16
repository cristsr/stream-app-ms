import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'app/auth/services';
import { IS_PUBLIC_KEY } from 'app/auth/decorators';
import { Socket } from 'socket.io';
import { StreamEvents } from 'app/stream/constants';

@Injectable()
export class WsGuard implements CanActivate {
  private logger = new Logger(WsGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const socket: Socket = context.switchToWs().getClient();

    return this.authorize(socket);
  }

  async authorize(socket: Socket): Promise<boolean> {
    const authorization = socket.handshake.headers.authorization as string;

    if (!authorization) {
      socket.emit(StreamEvents.ERRORS, {
        error: 'Unauthorized',
        message: 'Token not provided',
      });

      socket.disconnect();

      return;
    }

    const payload = await this.authService
      .verifyToken(authorization)
      .catch(() => null);

    if (!payload) {
      this.logger.error('Jwt token is invalid');

      socket.emit(StreamEvents.ERRORS, {
        error: 'Unauthorized',
        message: 'Token is invalid',
      });

      socket.disconnect();

      return;
    }

    if (!Object.keys(socket.data).length) {
      this.logger.log('Socket data not initialized');
      socket.data = await this.authService.profile(payload.sub);
    }

    return true;
  }
}
