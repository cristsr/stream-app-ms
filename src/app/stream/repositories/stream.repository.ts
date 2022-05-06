import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream, StreamDocument } from 'app/stream/schemas';

@Injectable()
export class StreamRepository {
  private logger = new Logger(StreamRepository.name);

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
    await this.stream.create({ user, key, title: '' });
  }

  async update(
    criteria: Record<string, any>,
    partial: Record<string, any>,
  ): Promise<void> {
    try {
      await this.stream.updateOne(criteria, partial, { new: true }).exec();
    } catch (e) {
      this.logger.error(`Error updating stream: ${e.message}`);
      return;
    }
  }
}
