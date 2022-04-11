import {
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser, Public } from 'app/auth/decorators';
import { StreamEvents } from 'app/stream/constants';
import { StreamService } from 'app/stream/services';
import { UserDto } from 'app/auth/dtos';

@Controller('stream')
export class StreamController {
  private logger = new Logger(StreamController.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
  ) {}

  @Public()
  @Get(':username')
  async getStreamByUsername(@Param('username') username: string) {
    this.logger.log(`Getting stream for user ${username}`);
    return this.streamService.getStreamByUsername(username);
  }

  @Public()
  @Get('connect/:key')
  async connectStream(@Param('key') key: string) {
    this.logger.log(`Connecting stream ${key}`);
    const stream = await this.streamService.getStreamByKey(key);

    if (!stream) {
      throw new NotFoundException(`Stream with key ${key} not found`);
    }

    this.eventEmitter.emit(StreamEvents.ADD, stream);
    return stream;
  }

  @Public()
  @Delete(':id')
  disconnectStream(@Param('id') key: string) {
    this.logger.log(`Stream ${key} disconnected`);
    this.eventEmitter.emit(StreamEvents.REMOVE, key);
    return key;
  }

  @Get('restore')
  restore(@CurrentUser() user: UserDto) {
    return this.streamService.restoreKey(user);
  }
}
