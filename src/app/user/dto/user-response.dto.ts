import { AutoMap } from '@automapper/classes';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @AutoMap()
  @IsString()
  id: string;

  @AutoMap()
  @IsString()
  name: string;

  @AutoMap()
  @IsString()
  username: string;

  @AutoMap()
  @IsString()
  image: string;

  @AutoMap()
  @IsEmail()
  email: string;
}
