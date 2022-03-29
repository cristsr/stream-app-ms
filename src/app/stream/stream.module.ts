import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stream, StreamSchema } from './schemas/streamSchema';
import { StreamService } from './services/stream.service';
import { StreamKeyController } from './controllers/stream-key.controller';
import { StreamKeyRepository } from './repositories/stream-key.repository';
import { StreamController } from './controllers/stream.controller';
import { StreamGateway } from './gateway/stream.gateway';
import { OnlineStream } from './providers/online-stream';
import { AuthModule } from 'app/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Stream.name,
        schema: StreamSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [StreamKeyController, StreamController],
  providers: [StreamGateway, StreamService, StreamKeyRepository, OnlineStream],
})
export class StreamModule {}
