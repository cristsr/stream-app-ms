import { IsString } from 'class-validator';
import { UserDto } from 'app/auth/dtos';

export class StreamReq {
  @IsString()
  id: string;

  @IsString()
  key: string;
}

export class StreamRes {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnail: string;
  user: UserDto;
}
