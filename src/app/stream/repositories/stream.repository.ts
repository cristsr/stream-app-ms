import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream, StreamDocument } from 'app/stream/schemas';

@Injectable()
export class StreamRepository {
  constructor(
    @InjectModel(Stream.name)
    private stream: Model<StreamDocument>,
  ) {}

  findByUserId(id: string): Promise<Stream> {
    return this.stream.findOne({ user: id }).exec();
  }

  async findByKey(key: string): Promise<Stream> {
    const stream = await this.stream.findOne({ key }).populate('user').exec();

    if (!stream) {
      return null;
    }

    return stream.toObject({
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    });
  }

  async create(user: string, key: string): Promise<void> {
    await this.stream.create({ user, key });
  }

  async update(id: string, partial: Record<string, any>): Promise<void> {
    await this.stream.updateOne({ id }, partial).exec();
  }

  findByUsername(username: string): Promise<Stream> {
    return this.stream
      .findOne({
        user: {
          username,
        },
      })
      .exec();
  }
}
