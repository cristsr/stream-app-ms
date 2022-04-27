import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'app/user/schemas/user.schema';
import { RegisterUserReq } from 'app/auth/dtos';
import { classToPlain, plainToClass } from 'class-transformer';
import { UpdateUser } from 'app/user/dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(registerUser: RegisterUserReq): Promise<void> {
    await this.userModel.create(registerUser);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      return null;
    }

    const rawUser = classToPlain(user.toJSON({ virtuals: true }));
    return plainToClass(User, rawUser, { excludePrefixes: ['_'] });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    const rawUser = classToPlain(user.toJSON({ virtuals: true }));
    return plainToClass(User, rawUser, { excludePrefixes: ['_'] });
  }

  async update(id: string, updateUserDto: UpdateUser): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!user) {
      return null;
    }

    const rawUser = classToPlain(user.toJSON({ virtuals: true }));
    return plainToClass(User, rawUser, { excludePrefixes: ['_'] });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
