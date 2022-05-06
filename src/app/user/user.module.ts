import { Module } from '@nestjs/common';
import { UserService } from 'app/user/services';
import { UserController } from './controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'app/user/schemas';
import { UserRepository } from 'app/user/repositories';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [UserRepository],
})
export class UserModule {}
