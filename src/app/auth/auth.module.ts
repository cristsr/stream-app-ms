import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from 'app/auth/services';
import { AuthController } from 'app/auth/controllers';
import { HttpGuard, WsGuard } from 'app/auth/guards';
import { UserModule } from 'app/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: HttpGuard,
    },
    WsGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, WsGuard],
})
export class AuthModule {}
