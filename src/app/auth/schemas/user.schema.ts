import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export type UserDocument = User & Document;

@Schema()
export class User {
  @IsString()
  @AutoMap()
  id: string;

  @Prop({ required: true })
  @IsString()
  @AutoMap()
  name: string;

  @Prop({ required: true })
  @IsString()
  @AutoMap()
  email: string;

  @Prop({ required: true })
  @IsString()
  @AutoMap()
  image: string;

  @Prop({ required: true })
  @IsString()
  @AutoMap()
  username: string;

  @Prop({ required: true })
  @IsString()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
