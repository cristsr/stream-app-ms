import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { mapEnvironmentKeys } from 'src/environment/utils';

export class Environment {
  @IsString()
  ENV: string = null;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  PORT: number = null;

  @IsString()
  DB_URI: string = null;

  @IsString()
  JWT_SECRET: string = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  JWT_EXPIRES_IN: number = null;

  @Transform(({ value }) => +value)
  @IsNumber()
  BCRYPT_ROUNDS: number = null;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  SHOW_DOCS: boolean = null;

  @IsString()
  HLS_SERVER: string = null;
}

export const ENV = mapEnvironmentKeys<Environment>(Environment);
