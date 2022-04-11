import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ENV } from 'environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();

  app.setGlobalPrefix('api');

  const showDocs: boolean = configService.get(ENV.SHOW_DOCS);

  if (showDocs) {
    const config = new DocumentBuilder()
      .setTitle('Stream api')
      .setDescription('The stream API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: false,
    });
  }

  const port = configService.get(ENV.PORT);
  const env = configService.get(ENV.ENV);

  await app.listen(port);

  Logger.log(`App running in port ${port} at env ${env}`, 'Bootstrap');
}
bootstrap();
