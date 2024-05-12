import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGatewayGateway } from './notification-gateway.gateway';

describe('NotificationGatewayGateway', () => {
  let gateway: NotificationGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationGatewayGateway],
    }).compile();

    gateway = module.get<NotificationGatewayGateway>(NotificationGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
