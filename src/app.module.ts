import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'database';
import { AppController } from './app.controller';
import { validate } from 'environment';
import { AuthModule } from 'app/auth/auth.module';
import { StreamModule } from 'app/stream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    AuthModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
