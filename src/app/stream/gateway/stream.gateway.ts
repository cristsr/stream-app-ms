import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChangeTitleDto, StreamRes } from 'app/stream/dtos';
import { StreamEvents } from 'app/stream/constants';
import { OnlineStreamRepository } from 'app/stream/repositories';
import { StreamService } from 'app/stream/services';

@WebSocketGateway({
  namespace: 'stream',
})
export class StreamGateway implements OnGatewayConnection {
  private logger = new Logger(StreamGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private onlineStream: OnlineStreamRepository,
    private streamService: StreamService,
  ) {}

  async handleConnection(socket: Socket) {
    this.logger.log('New socket connected ' + socket.id);
    const streams = this.onlineStream.getAll();
    socket.emit('streams', streams);
  }

  @SubscribeMessage(StreamEvents.UPDATE_TITLE)
  async changeTitle(@MessageBody() { username, title }: ChangeTitleDto) {
    this.logger.log(`${username} changed title to ${title}`);
    const stream = this.onlineStream.getByUsername(username);

    await this.streamService.update(stream.id, { title }).catch((e) => {
      this.logger.error(`Error updating stream: ${e.message}`);
      return null;
    });

    if (!stream) {
      this.logger.error(`${username} streamer not found`);
      return;
    }

    stream.title = title;
    this.server.emit(StreamEvents.UPDATE_TITLE, stream);
  }

  @SubscribeMessage(StreamEvents.JOIN_ROOM)
  connectChat(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    this.logger.log('New user joined to room ' + room);
    socket.join(room);
  }

  @SubscribeMessage(StreamEvents.ROOM_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Record<string, string>,
  ) {
    this.logger.log(
      `New message from ${payload.username} to room ${payload.room}`,
    );

    this.server.to(payload.room).emit(StreamEvents.ROOM_MESSAGE, payload);
  }

  @SubscribeMessage(StreamEvents.LEAVE_ROOM)
  leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    this.logger.log(`Socket ${socket.id} left room ${room}`);
    socket.leave(room);
  }

  @OnEvent(StreamEvents.ADD)
  addStream(stream: StreamRes) {
    this.logger.log(`Add stream ${stream.username}`);
    this.onlineStream.add(stream);
    this.server.emit('add-stream', stream);
  }

  @OnEvent(StreamEvents.REMOVE)
  removeStream(username: string) {
    this.logger.log('Streamer disconnected ' + username);
    this.onlineStream.remove(username);
    this.server.emit('remove-stream', username);
  }
}
