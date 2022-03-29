import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StreamRes } from 'app/stream/dtos';
import { OnEvent } from '@nestjs/event-emitter';
import { StreamEvents } from 'app/stream/constants';

@WebSocketGateway({
  namespace: 'stream',
})
export class StreamGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private onlineStreams = new Map<string, StreamRes>();

  handleConnection(client: Socket) {
    const streams = this.getStreams();
    client.emit('streams', streams);
  }

  @OnEvent(StreamEvents.ADD)
  addStream(stream: StreamRes) {
    this.onlineStreams.set(stream.id, stream);
    this.server.emit('add-stream', stream);
  }

  @OnEvent(StreamEvents.REMOVE)
  removeStream(stream: StreamRes) {
    this.onlineStreams.delete(stream.id);
    this.server.emit('remove-stream', stream.id);
  }

  private getStreams(): StreamRes[] {
    return Array.from(this.onlineStreams.values());
  }
}
