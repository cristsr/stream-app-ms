import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { compare, hash } from 'bcrypt';

import {
  LoginUserReq,
  RegisterUserReq,
  LoginUserRes,
  UserDto,
  JwtPayload,
} from 'app/auth/dtos';
import { UserRepository } from 'app/auth/repositories';
import { ENV } from 'environment';
import { User } from 'app/auth/schemas/user.schema';

@Injectable()
export class AuthService implements OnModuleInit {
  private logger = new Logger(AuthService.name);

  constructor(
    private config: ConfigService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @InjectMapper() private mapper: Mapper,
  ) {}

  onModuleInit(): void {
    this.mapper.createMap(User, UserDto);
  }

  async login(loginUser: LoginUserReq): Promise<LoginUserRes> {
    const user: User = await this.userRepository.findByEmail(loginUser.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matchPassword = await compare(
      loginUser.password,
      user.password,
    ).catch((e) => {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'Error comparing passwords: ' + e.message,
      );
    });

    if (!matchPassword) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        secret: this.config.get(ENV.JWT_SECRET),
        expiresIn: this.config.get(ENV.JWT_EXPIRES_IN),
      },
    );

    const userRes = this.mapper.map(user, UserDto, User);

    this.logger.log(userRes);

    return {
      token,
      user: userRes,
    };
  }

  async register(user: RegisterUserReq): Promise<void> {
    if (await this.userRepository.findByEmail(user.email)) {
      this.logger.error('User is registered: ' + user.email);
      throw new BadRequestException('User is registered');
    }

    this.logger.log('User is not registered: ' + user.email);

    user.password = await hash(
      user.password,
      this.config.get(ENV.BCRYPT_ROUNDS),
    );

    await this.userRepository.register(user);

    this.logger.log('User registered successfully: ' + user.email);
  }

  verifyToken(token: string): Promise<JwtPayload> {
    const value = token.replace(/^Bearer\s+/, '');

    return this.jwtService.verifyAsync(value, {
      secret: this.config.get(ENV.JWT_SECRET),
    });
  }

  async profile(id: string): Promise<UserDto> {
    const userDocument = await this.userRepository.findById(id).catch((e) => {
      this.logger.error(e.message);
      throw new NotFoundException('User not found');
    });

    this.mapper.createMap(User, UserDto);

    return this.mapper.map(userDocument, UserDto, User);
  }

  async refresh(user) {
    return {};
  }
}
