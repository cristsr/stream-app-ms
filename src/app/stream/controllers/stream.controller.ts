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
import { UserDto } from 'app/auth/dtos';
import { StreamReq } from 'app/stream/dtos';

@Controller('stream')
export class StreamController {
  private logger = new Logger(StreamController.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
  ) {}

  @Get('key')
  async getKey(@CurrentUser() user: UserDto) {
    const [result, error] = await this.streamService.getStreamKey(user);

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
  async connectStream(@Body() body: StreamReq) {
    this.logger.log(`Connecting stream ${body.key}`);

    // update thumbnail
    await this.streamService.update(body.key, {
      thumbnail: body.thumbnail,
    });

    const stream = await this.streamService.getStream(body.key);

    if (!stream) {
      throw new NotFoundException(`Stream with key ${body.key} not found`);
    }

    this.eventEmitter.emit(StreamEvents.ADD, stream);

    return stream;
  }

  @Public()
  @Delete('disconnect/:key')
  async disconnectStream(@Param('key') key: string) {
    this.logger.log(`Stream ${key} disconnected`);

    const stream = await this.streamService.getStream(key);

    if (!stream) {
      throw new NotFoundException(`Stream with key ${key} not found`);
    }

    this.eventEmitter.emit(StreamEvents.REMOVE, stream.username);
    return key;
  }
}
