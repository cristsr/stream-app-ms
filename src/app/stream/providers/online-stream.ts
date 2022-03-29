import { Injectable } from '@nestjs/common';
import { StreamRes } from 'app/stream/dtos';

@Injectable()
export class OnlineStream {
  private onlineStreams = new Map<string, StreamRes>();

  getAll() {
    return Array.from(this.onlineStreams.values());
  }

  get(id: string) {
    return this.onlineStreams.get(id);
  }

  add(stream: StreamRes) {
    this.onlineStreams.set(stream.id, stream);
  }

  remove(id: string) {
    this.onlineStreams.delete(id);
  }
}
