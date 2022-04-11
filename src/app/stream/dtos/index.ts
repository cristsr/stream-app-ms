import { IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class StreamReq {
  @IsString()
  @AutoMap()
  id: string;

  @IsString()
  @AutoMap()
  key: string;

  @IsString()
  user: string;
}

export class StreamRes {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  url?: string;

  @IsString()
  thumbnail: string;

  @IsString()
  username: string;
}

export class ChangeTitleDto {
  @IsString()
  username: string;

  @IsString()
  title: string;
}
