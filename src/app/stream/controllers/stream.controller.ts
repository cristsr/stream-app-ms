import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser, Public } from 'app/auth/decorators';
import { StreamEvents } from 'app/stream/constants';
import { StreamService } from 'app/stream/services';
import { UserDto } from 'app/user/dto';
import { StreamReq } from 'app/stream/dtos';

@Controller('stream')
export class StreamController {
  private logger = new Logger(StreamController.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
  ) {}

  @Get('key')
  async getKey(@CurrentUser() { id }: UserDto) {
    const [result, error] = await this.streamService.getStreamKey(id);

    if (error) {
      throw new NotFoundException(`Stream key not found`);
    }

    return result;
  }

  @Get('title')
  async getStreamTitle(@CurrentUser() { id }: UserDto) {
    const [result, error] = await this.streamService.getStreamTitle(id);

    if (error) {
      throw new NotFoundException(`Stream key not found`);
    }

    return result;
  }

  @Get('key/restore')
  restore(@CurrentUser() user: UserDto) {
    this.logger.log(`Restoring stream key for user ${user.id}`);
    return this.streamService.restoreKey(user);
  }

  @Public()
  @Get(':username')
  getStreamByUsername(@Param('username') username: string) {
    this.logger.log(`Getting stream for user ${username}`);
    return this.streamService.getStreamByUsername(username);
  }

  @Public()
  @Post('connect')
  async connectStream(@Body() { key, thumbnail }: StreamReq) {
    this.logger.log(`Connecting stream ${key}`);

    this.logger.log(`thumbnail: ${thumbnail}`);

    // update thumbnail
    await this.streamService.update({ key }, { thumbnail });

    const stream = await this.streamService.getStreamByKey(key);

    if (!stream) {
      throw new NotFoundException(`Stream with key ${key} not found`);
    }

    this.eventEmitter.emit(StreamEvents.ADD, stream);

    return stream;
  }

  @Public()
  @Delete('disconnect/:key')
  async disconnectStream(@Param('key') key: string) {
    this.logger.log(`Stream ${key} disconnected`);

    const stream = await this.streamService.getStreamByKey(key);

    if (!stream) {
      throw new NotFoundException(`Stream with key ${key} not found`);
    }

    this.eventEmitter.emit(StreamEvents.REMOVE, stream.username);
    return key;
  }
}
