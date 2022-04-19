import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'app/auth/schemas/user.schema';
import { RegisterUserReq } from 'app/auth/dtos';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  register(registerUser: RegisterUserReq): Promise<UserDocument> {
    return this.userModel.create(registerUser);
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
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

  update(id: string, updateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
