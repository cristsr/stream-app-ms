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

  async findByUserId(id: string): Promise<Stream> {
    const stream = await this.stream
      .findOne({ user: id })
      .populate('user')
      .exec();

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

  async findByIdAndUpdate(
    id: string,
    partial: Record<string, any>,
  ): Promise<Stream> {
    return this.stream.findByIdAndUpdate(id, partial, { new: true }).exec();
  }

  updateByUserId(id: string, partial: Record<string, any>): Promise<any> {
    return this.stream.updateOne({ user: id }, partial, { new: true }).exec();
  }

  updateByKey(key: string, partial: Record<string, any>) {
    return this.stream.updateOne({ key }, partial, { new: true }).exec();
  }
}
