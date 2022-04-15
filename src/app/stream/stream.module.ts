import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stream, StreamSchema } from 'app/stream/schemas';
import { StreamService } from 'app/stream/services';
import { StreamController } from 'app/stream/controllers';
import { StreamGateway } from 'app/stream/gateway';
import {
  StreamRepository,
  OnlineStreamRepository,
} from 'app/stream/repositories';
import { ChatService } from './services/chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Stream.name,
        schema: StreamSchema,
      },
    ]),
  ],
  controllers: [StreamController],
  providers: [
    StreamGateway,
    StreamService,
    StreamRepository,
    OnlineStreamRepository,
    ChatService,
  ],
})
export class StreamModule {}
