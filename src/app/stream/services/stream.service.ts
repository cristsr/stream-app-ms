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
import { Stream } from 'app/stream/schemas';

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
      await this.streamRepository.findByIdAndUpdate(user.id, { key });
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

  async getStream(key, thumbnail?): Promise<StreamRes> {
    const document = thumbnail
      ? await this.streamRepository.findByIdAndUpdate(key, {
          thumbnail,
        })
      : await this.streamRepository.findByKey(key);

    if (!document) {
      this.logger.error(`Stream with key ${key} not found`);
      return null;
    }

    this.logger.log(`Stream with key ${key} found`);

    return this.mapStream(document);
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

    return this.mapStream(document);
  }

  async update(id: string, partial: Record<string, any>) {
    return this.streamRepository.findByIdAndUpdate(id, partial);
  }

  private async mapStream(document: Stream): Promise<StreamRes> {
    const stream = new StreamRes();

    stream.id = document.id;
    stream.username = document.user.username;
    stream.title = document.title;
    stream.url = this.configService
      .get(ENV.HLS_SERVER)
      .concat('/live/{KEY}/index.m3u8')
      .replace('{KEY}', document.key);

    // stream.thumbnail =
    //   'https://static-cdn.jtvnw.net/previews-ttv/live_user_valorant-440x248.jpg';
    stream.thumbnail = document.thumbnail;
    stream.userpicture = document.user.image;

    return stream;
  }
}
