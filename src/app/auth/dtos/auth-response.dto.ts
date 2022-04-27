import { IsJWT, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from 'app/user/dto';

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

export class JwtPayload {
  @IsString()
  sub: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
