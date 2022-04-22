import { IsOptional, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class StreamReq {
  @IsString()
  @AutoMap()
  key: string;

  @IsString()
  @IsOptional()
  thumbnail: string;
}

export class StreamRes {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  username: string;

  @IsString()
  userpicture: string;

  @IsString()
  url?: string;

  @IsString()
  thumbnail?: string;
}

export class ChangeTitleDto {
  @IsString()
  username: string;

  @IsString()
  title: string;
}
