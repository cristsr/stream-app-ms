import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from 'app/auth/services';
import { AuthController } from 'app/auth/controllers';
import { User, UserSchema } from 'app/auth/schemas';
import { UserRepository } from 'app/auth/repositories';
import { HttpGuard, WsGuard } from 'app/auth/guards';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    AuthService,
    UserRepository,
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
