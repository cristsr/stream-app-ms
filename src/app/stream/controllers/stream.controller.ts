import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from 'app/auth/decorators';
import { StreamEvents } from 'app/stream/constants';
import { StreamReq } from 'app/stream/dtos';
import { StreamService } from '../services/stream.service';

@Controller('stream')
export class StreamController {
  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
  ) {}

  @Public()
  @Post('add')
  async addStream(@Body() data: StreamReq) {
    const stream = await this.streamService.getStream(data);

    console.log(stream);

    this.eventEmitter.emit(StreamEvents.ADD, data);
  }

  @Public()
  @Post('remove')
  removeStream(@Body() data: StreamReq) {
    this.eventEmitter.emit(StreamEvents.REMOVE, data);
  }
}
