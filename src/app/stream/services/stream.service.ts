import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UserDto } from 'app/auth/dtos';
import { StreamKeyRepository } from 'app/stream/repositories/stream-key.repository';
import { StreamReq } from 'app/stream/dtos';
import { UserRepository } from 'app/auth/repositories';

@Injectable()
export class StreamService {
  constructor(
    private streamRepository: StreamKeyRepository,
    private userRepository: UserRepository,
  ) {}

  async restoreKey(user: UserDto) {
    const key = randomBytes(10).toString('hex');

    const record = await this.streamRepository.findByUserId(user.id);

    if (!record) {
      await this.streamRepository.create(user.id, key);
    } else {
      await this.streamRepository.update(user.id, key);
    }

    return key;
  }

  async getStream(stream: StreamReq): Promise<any> {
    const streamDocument = await this.streamRepository.findByKey(stream.key);

    if (!streamDocument) {
      return null;
    }

    return streamDocument;
  }
}
