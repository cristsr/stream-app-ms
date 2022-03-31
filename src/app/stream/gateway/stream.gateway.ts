import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChangeTitleDto, StreamRes } from 'app/stream/dtos';
import { OnEvent } from '@nestjs/event-emitter';
import { StreamEvents } from 'app/stream/constants';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'stream',
})
export class StreamGateway implements OnGatewayConnection {
  private logger = new Logger(StreamGateway.name);

  @WebSocketServer()
  server: Server;

  private onlineStreams = new Map<string, StreamRes>();

  handleConnection(client: Socket) {
    this.logger.log('New client connected ' + client.id);
    const streams = this.getStreams();
    client.emit('streams', streams);
  }

  @SubscribeMessage('update-title')
  async changeTitle(client: Socket, @MessageBody() data: ChangeTitleDto) {
    this.logger.log('Change title ' + data.title);

    const stream = this.onlineStreams.get(data.id);

    if (!stream) {
      return;
    }

    stream.title = data.title;

    this.server.emit('update-title', stream);
  }

  @OnEvent(StreamEvents.ADD)
  addStream(stream: StreamRes) {
    this.logger.log('New streamer connected ' + stream.id);
    this.onlineStreams.set(stream.id, stream);
    this.server.emit('add-stream', stream);
  }

  @OnEvent(StreamEvents.REMOVE)
  removeStream(key: string) {
    this.logger.log('Streamer disconnected ' + key);
    this.onlineStreams.delete(key);
    this.server.emit('remove-stream', key);
  }

  private getStreams(): StreamRes[] {
    return Array.from(this.onlineStreams.values());
  }
}
