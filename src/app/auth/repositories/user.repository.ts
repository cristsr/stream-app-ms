import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'app/auth/schemas/user.schema';
import { RegisterUserReq } from 'app/auth/dtos';

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

  findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, updateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }
}
