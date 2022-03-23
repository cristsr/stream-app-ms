import { IsEmail, IsJWT, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserRes {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  image: string;

  @IsEmail()
  email: string;
}

export class LoginUserRes {
  @IsJWT()
  token: string;

  @Type(() => UserRes)
  user: UserRes;
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
