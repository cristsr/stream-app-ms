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
import { StreamEvents, StreamMessages } from 'app/stream/constants';
import { OnlineStreamRepository } from 'app/stream/repositories';

@WebSocketGateway({
  namespace: 'stream',
})
export class StreamGateway implements OnGatewayConnection {
  private logger = new Logger(StreamGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private onlineStream: OnlineStreamRepository) {}

  async handleConnection(socket: Socket) {
    this.logger.log('New socket connected ' + socket.id);
    const streams = this.onlineStream.getAll();
    socket.emit('streams', streams);
  }

  @SubscribeMessage(StreamMessages.UPDATE_TITLE)
  async changeTitle(@MessageBody() { username, title }: ChangeTitleDto) {
    this.logger.log(`${username} changed title to ${title}`);
    const stream = this.onlineStream.getByUsername(username);

    if (!stream) {
      this.logger.error(`${username} streamer not found`);
      return;
    }

    stream.title = title;
    this.server.emit('update-title', stream);
  }

  @SubscribeMessage(StreamMessages.JOIN_ROOM)
  connectChat(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    this.logger.log('New user joined to room ' + room);
    socket.join(room);
  }

  @SubscribeMessage(StreamMessages.ROOM_MESSAGE)
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: Record<string, string>,
  ) {
    this.logger.log(
      'New message from ' + socket.id + ' to room ' + payload.room,
    );
    this.server.to(payload.room).emit(StreamMessages.ROOM_MESSAGE, payload);
  }

  @SubscribeMessage(StreamMessages.LEAVE_ROOM)
  leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() room: string) {
    this.logger.log('User left chat of ' + room);
    socket.leave(room);
  }

  @OnEvent(StreamEvents.ADD)
  addStream(stream: StreamRes) {
    this.logger.log(`Add stream ${stream.username}`);
    this.onlineStream.add(stream);
    this.server.emit('add-stream', stream);

    // create chat room
    // this.server.
  }

  @OnEvent(StreamEvents.REMOVE)
  removeStream(username: string) {
    this.logger.log('Streamer disconnected ' + username);
    this.onlineStream.remove(username);
    this.server.emit('remove-stream', username);
  }

  run() {
    this.server.on('', (socket, data) => {
      console.log(data);
    });
  }
}
