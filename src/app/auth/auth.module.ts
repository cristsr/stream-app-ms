import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

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
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [UserRepository],
})
export class AuthModule {}
