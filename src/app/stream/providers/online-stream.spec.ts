import { Test, TestingModule } from '@nestjs/testing';
import { OnlineStream } from './online-stream';

describe('StreamService', () => {
  let service: OnlineStream;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineStream],
    }).compile();

    service = module.get<OnlineStream>(OnlineStream);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
