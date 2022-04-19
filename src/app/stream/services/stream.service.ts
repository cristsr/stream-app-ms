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

@Injectable()
export class StreamService {
  private logger = new Logger(StreamService.name);

  constructor(
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
      await this.streamRepository.update(user.id, { key });
    }

    return key;
  }

  async getStreamByKey(key): Promise<StreamRes> {
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
    stream.url = this.configService
      .get(ENV.HLS_SERVER)
      .concat('/live/{KEY}/index.m3u8')
      .replace('{KEY}', key);
    // stream.thumbnail = this.configService
    //   .get(ENV.HLS_SERVER)
    //   .concat('/thumbnail/{KEY}.png')
    //   .replace('{KEY}', key);

    stream.thumbnail =
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_valorant-440x248.jpg';
    stream.userpicture = document.user.image;

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
    stream.url = this.configService
      .get(ENV.HLS_SERVER)
      .concat('/live/{KEY}/index.m3u8')
      .replace('{KEY}', document.key);

    stream.thumbnail =
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_valorant-440x248.jpg';
    stream.userpicture = document.user.image;

    return stream;
  }

  async getStreamKey(user: UserDto): Promise<[string, string]> {
    const document = await this.streamRepository.findByUserId(user.id);

    if (!document) {
      this.logger.error(`Stream with user id ${user.id} not found`);
      return [null, 'Stream not found'];
    }

    this.logger.log(`Stream with user id ${user.id} found`);

    return [document.key, null];
  }

  async update(id: string, partial: Record<string, any>) {
    return this.streamRepository.update(id, partial);
  }
}
