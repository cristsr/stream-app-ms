import { Controller, Get } from '@nestjs/common';
import { StreamService } from '../services/stream.service';
import { CurrentUser } from 'app/auth/decorators';
import { UserDto } from 'app/auth/dtos';

@Controller('stream-key')
export class StreamKeyController {
  constructor(private streamService: StreamService) {}

  @Get('restore')
  create(@CurrentUser() user: UserDto) {
    return this.streamService.restoreKey(user);
  }
}
