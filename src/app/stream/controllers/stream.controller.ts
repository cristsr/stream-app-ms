import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from 'app/auth/decorators';
import { StreamEvents } from 'app/stream/constants';
import { StreamReq, StreamRes } from 'app/stream/dtos';
import { StreamService } from '../services/stream.service';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';

@Controller('stream')
export class StreamController {
  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post('add')
  async addStream(@Body() data: StreamReq) {
    const hlsServer = this.config.get(ENV.HLS_SERVER);

    const stream = new StreamRes();
    stream.id = data.id;
    stream.title = 'Stream Title';
    stream.description = 'Stream Description';
    // TODO: hardcoded stream thumbnail
    stream.thumbnail =
      'https://di.phncdn.com/videos/202012/24/379000862/thumbs_10/(m=eafTGgaaaa)(mh=87fbyekHghXDTL-D)8.jpg';
    stream.user = data.user;
    stream.url = hlsServer.replace('{KEY}', data.key);

    console.log(stream);

    this.eventEmitter.emit(StreamEvents.ADD, stream);
  }

  @Public()
  @Delete('remove/:key')
  removeStream(@Param('key') key: string) {
    console.log('remove stream', key);
    this.eventEmitter.emit(StreamEvents.REMOVE, key);
  }
}
