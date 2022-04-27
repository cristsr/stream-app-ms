import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { UpdateUser, UserDto } from 'app/user/dto';
import { Mapper } from '@automapper/core';
import { User } from 'app/user/schemas';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async update(id: string, partialUser: UpdateUser): Promise<UserDto> {
    const user = await this.userRepository.update(id, partialUser);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.mapper.map(user, UserDto, User);
  }
}
