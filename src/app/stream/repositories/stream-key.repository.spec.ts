import { Test, TestingModule } from '@nestjs/testing';
import { StreamKeyRepository } from './stream-key.repository';

describe('StreamService', () => {
  let service: StreamKeyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamKeyRepository],
    }).compile();

    service = module.get<StreamKeyRepository>(StreamKeyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
