import { IsEmail, IsJWT, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

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

export class LoginUserRes {
  @IsJWT()
  token: string;

  @Type(() => UserDto)
  user: UserDto;
}

export class JwtRes {
  @IsJWT()
  token: string;
}

export class Credentials {
  @IsString()
  token: string;

  @IsString()
  expiresIn: number;

  @IsString()
  refreshToken: string;

  @IsString()
  expiresInRefresh: number;
}

export class JwtPayload {
  @IsString()
  sub: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
