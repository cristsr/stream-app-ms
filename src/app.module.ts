import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DatabaseModule } from 'database';
import { validate } from 'environment';
import { AuthModule } from 'app/auth/auth.module';
import { StreamModule } from 'app/stream/stream.module';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'mapper', pluginInitializer: classes }],
      singular: true,
    }),
    EventEmitterModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
