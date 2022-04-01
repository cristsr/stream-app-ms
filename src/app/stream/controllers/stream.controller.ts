import {
  Body,
  Controller,
  Delete,
  Logger,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from 'app/auth/decorators';
import { StreamEvents } from 'app/stream/constants';
import { StreamReq, StreamRes } from 'app/stream/dtos';
import { StreamService } from '../services/stream.service';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from 'app/auth/dtos';

@Controller('stream')
export class StreamController implements OnModuleInit {
  private logger = new Logger(StreamController.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private streamService: StreamService,
    private config: ConfigService,
    @InjectMapper() private mapper: Mapper,
  ) {}

  onModuleInit(): any {
    this.mapper.createMap(StreamReq, StreamRes);
    this.mapper.createMap(UserDto, UserDto);
  }

  @Public()
  @Post()
  async addStream(@Body() data: StreamReq) {
    const hlsServer = this.config.get(ENV.HLS_SERVER);

    const stream = this.mapper.map(data, StreamRes, StreamReq);
    stream.title = 'Stream Title';
    stream.description = 'Stream Description';
    // // TODO: hardcoded stream thumbnail
    stream.thumbnail =
      'https://di.phncdn.com/videos/202012/24/379000862/thumbs_10/(m=eafTGgaaaa)(mh=87fbyekHghXDTL-D)8.jpg';
    stream.user = data.user;
    stream.url = hlsServer.replace('{KEY}', data.key);

    this.logger.log(stream);

    this.eventEmitter.emit(StreamEvents.ADD, stream);

    return stream;
  }

  @Public()
  @Delete(':key')
  removeStream(@Param('key') key: string) {
    this.logger.log('remove stream key: ' + key);
    this.eventEmitter.emit(StreamEvents.REMOVE, key);
    return key;
  }
}
