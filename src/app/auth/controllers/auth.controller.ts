import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { JwtRes, LoginUserReq, RegisterUserReq } from 'app/auth/dtos';
import { AuthService } from 'app/auth/services';
import { Public } from 'app/auth/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(@Body() register: RegisterUserReq): Promise<void> {
    return this.authService.register(register);
  }

  @Public()
  @Post('login')
  async login(@Body() login: LoginUserReq): Promise<JwtRes> {
    return this.authService.login(login);
  }

  @Public()
  @Get('refresh')
  refreshToken(@Headers('refresh') refresh: string) {
    if (!refresh) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refresh(refresh);
  }
}
