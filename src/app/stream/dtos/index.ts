import { IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'app/auth/dtos';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class StreamReq {
  @IsString()
  @AutoMap()
  id: string;

  @IsString()
  @AutoMap()
  key: string;

  @Type(() => UserDto)
  @ValidateNested()
  @AutoMap({ typeFn: () => UserDto })
  user: UserDto;
}

export class StreamRes {
  @AutoMap()
  id: string;

  title: string;

  url: string;

  thumbnail: string;

  @AutoMap({ typeFn: () => UserDto })
  user: UserDto;
}

export class ChangeTitleDto {
  @IsString()
  id: string;

  @IsString()
  title: string;
}
