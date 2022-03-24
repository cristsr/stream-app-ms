import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { Public } from 'app/auth/decorators';

@Public()
@Controller('health')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  health() {
    this.logger.log('Health check success');
  }
}
