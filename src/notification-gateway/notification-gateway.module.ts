import { Module } from '@nestjs/common';
import { NotificationGatewayGateway } from './notification-gateway.gateway';

@Module({
  providers: [NotificationGatewayGateway],
})
export class NotificationGatewayModule {}
