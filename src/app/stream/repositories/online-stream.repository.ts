import { Injectable } from '@nestjs/common';
import { StreamRes } from 'app/stream/dtos';

@Injectable()
export class OnlineStreamRepository {
  private roomViewers: Map<string, number> = new Map();
  private streams = new Map<string, StreamRes>();

  getAll() {
    return Array.from(this.streams.values());
  }

  getByUsername(username: string) {
    return this.streams.get(username);
  }

  add(stream: StreamRes) {
    this.streams.set(stream.username, stream);
  }

  remove(username: string) {
    this.streams.delete(username);
  }

  getViewers(room: string) {
    return this.roomViewers.get(room);
  }

  addViewer(room: string) {
    const viewers = this.roomViewers.get(room);
    this.roomViewers.set(room, viewers ? viewers + 1 : 1);
  }

  removeViewer(room: string) {
    const viewers = this.roomViewers.get(room);
    this.roomViewers.set(room, viewers ? viewers - 1 : 0);
  }
}
