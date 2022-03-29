import { Test, TestingModule } from '@nestjs/testing';
import { StreamKeyController } from './stream-key.controller';
import { StreamService } from '../services/stream.service';

describe('StreamController', () => {
  let controller: StreamKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamKeyController],
      providers: [StreamService],
    }).compile();

    controller = module.get<StreamKeyController>(StreamKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
