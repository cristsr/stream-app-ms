import { Controller, Patch, Body, Get } from '@nestjs/common';
import { UserService } from 'app/user/services';
import { CurrentUser } from 'app/auth/decorators';
import { UpdateUser, UserDto } from 'app/user/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  @Patch()
  update(
    @CurrentUser() { id }: UserDto,
    @Body() updateUser: UpdateUser,
  ): Promise<UserDto> {
    return this.userService.update(id, updateUser);
  }
}
