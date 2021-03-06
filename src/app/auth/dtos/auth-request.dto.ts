import { IsEmail, IsString } from 'class-validator';

export class RegisterUserReq {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  image: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginUserReq {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
