import { Injectable } from '@nestjs/common';
import { StreamRes } from 'app/stream/dtos';

@Injectable()
export class OnlineStreamRepository {
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
}
