import { Controller, Patch, Body, Get } from '@nestjs/common';
import { UserService } from 'app/user/services';
import { CurrentUser } from 'app/auth/decorators';
import { UpdateUser, UserDto } from 'app/user/dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StreamEvents } from 'app/stream/constants';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private eventEmmiter: EventEmitter2,
  ) {}

  @Get('profile')
  getProfile(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  @Patch()
  async update(
    @CurrentUser() { id }: UserDto,
    @Body() updateUser: UpdateUser,
  ): Promise<UserDto> {
    const user = await this.userService.update(id, updateUser);

    this.eventEmmiter.emit(StreamEvents.UPDATE_PROFILE, user);

    return user;
  }
}
