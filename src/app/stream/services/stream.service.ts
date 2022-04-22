import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { ENV } from 'environment';
import { UserDto } from 'app/auth/dtos';
import { StreamRes } from 'app/stream/dtos';
import {
  OnlineStreamRepository,
  StreamRepository,
} from 'app/stream/repositories';
import { UserRepository } from 'app/auth/repositories';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StreamService {
  private logger = new Logger(StreamService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private streamRepository: StreamRepository,
    private onlineStreamRepository: OnlineStreamRepository,
    private userRepository: UserRepository,
  ) {}

  async restoreKey(user: UserDto) {
    const key = randomBytes(10).toString('hex');

    const record = await this.streamRepository.findByUserId(user.id);

    if (!record) {
      this.logger.log(`Creating new stream record for user ${user.id}`);
      await this.streamRepository.create(user.id, key);
    } else {
      this.logger.log(`Updating stream record for user ${user.id}`);
      await this.streamRepository.updateByUserId(user.id, { key });
    }

    return key;
  }

  async getStreamKey(user: UserDto): Promise<[string, string]> {
    const document = await this.streamRepository.findByUserId(user.id);

    if (!document) {
      const key = randomBytes(10).toString('hex');
      await this.streamRepository.create(user.id, key);
      return [key, null];
    }

    this.logger.log(`Stream with user id ${user.id} found`);

    return [document.key, null];
  }

  async getStream(key): Promise<StreamRes> {
    const document = await this.streamRepository.findByKey(key);

    if (!document) {
      this.logger.error(`Stream with key ${key} not found`);
      return null;
    }

    this.logger.log(`Stream with key ${key} found`);

    const stream = new StreamRes();
    stream.id = document.id;
    stream.username = document.user.username;
    stream.title = document.title;
    stream.userpicture = document.user.image;
    stream.thumbnail = document.thumbnail;
    stream.url = this.configService
      .get(ENV.HLS_SERVER)
      .concat('/live/{KEY}/index.m3u8')
      .replace('{KEY}', document.key);

    return stream;
  }

  async getStreamByUsername(username: string): Promise<StreamRes> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      this.logger.error(`User with username ${username} not found`);
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const document = await this.streamRepository.findByUserId(user.id);

    if (!document) {
      this.logger.error(`Stream not found for username: ${username}`);
      throw new NotFoundException(`Stream ${username} not found`);
    }

    const stream = new StreamRes();
    stream.id = document.id;
    stream.username = document.user.username;
    stream.title = document.title;
    stream.userpicture = document.user.image;

    const isOnline = await this.onlineStreamRepository.getByUsername(username);

    if (isOnline) {
      stream.thumbnail = document.thumbnail;
      stream.url = this.configService
        .get(ENV.HLS_SERVER)
        .concat(`/live/${document.key}/index.m3u8`);
    }

    return stream;
  }

  async update(id: string, partial: Record<string, any>) {
    return this.streamRepository.findByIdAndUpdate(id, partial);
  }
}
