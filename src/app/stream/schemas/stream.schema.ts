import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'app/auth/schemas/user.schema';

export type StreamDocument = Stream & Document;

@Schema()
export class Stream {
  @Prop()
  id: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({ required: true })
  key: string;

  @Prop({ default: 'Awesome stream' })
  title: string;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
