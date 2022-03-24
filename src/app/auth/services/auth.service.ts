import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories';
import { compare, hash } from 'bcrypt';
import {
  LoginUserReq,
  RegisterUserReq,
  LoginUserRes,
  UserRes,
  JwtPayload,
} from 'app/auth/dtos';
import { ENV } from 'environment';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private config: ConfigService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(user: LoginUserReq): Promise<LoginUserRes> {
    const userDocument: UserDocument = await this.userRepository.findByEmail(
      user.email,
    );

    if (!userDocument) {
      throw new NotFoundException('User not found');
    }

    const matchPassword = await compare(user.password, userDocument.password);

    if (!matchPassword) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.jwtService.sign(
      {
        sub: userDocument.id,
      },
      {
        secret: this.config.get(ENV.JWT_SECRET),
        expiresIn: this.config.get(ENV.JWT_EXPIRES_IN),
      },
    );

    const userRes: UserRes = new UserRes();
    userRes.id = userDocument.id;
    userRes.email = userDocument.email;
    userRes.name = userDocument.name;
    userRes.username = userDocument.username;
    userRes.image = userDocument.image;

    this.logger.log(userDocument);

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

  async profile(id: string): Promise<UserRes> {
    const userDocument = await this.userRepository.findById(id).catch((e) => {
      this.logger.error(e.message);
      throw new NotFoundException('User not found');
    });

    const userRes: UserRes = new UserRes();
    userRes.id = userDocument.id;
    userRes.email = userDocument.email;
    userRes.name = userDocument.name;
    userRes.username = userDocument.username;
    userRes.image = userDocument.image;

    return userRes;
  }

  async refresh(user) {
    return {};
  }
}
