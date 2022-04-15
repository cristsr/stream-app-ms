import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private rooms = new Map<string, Map<string, Socket>>();

  public join(room: string, id: string, socket: Socket) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Map<string, Socket>());
    }
    this.rooms.get(room).set(id, socket);
  }

  public leave(room: string, id: string) {
    if (this.rooms.has(room)) {
      this.rooms.get(room).delete(id);
    }
  }

  public send(room: string, message: string) {
    if (this.rooms.has(room)) {
      this.rooms
        .get(room)
        .forEach((socket: Socket) => socket.emit('message', message));
    }
  }
}
