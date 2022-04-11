import { Test, TestingModule } from '@nestjs/testing';
import { StreamRepository } from './stream.repository';

describe('StreamService', () => {
  let service: StreamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamRepository],
    }).compile();

    service = module.get<StreamRepository>(StreamRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
