import { Module } from '@nestjs/common';
import { NotificationGatewayGateway } from './notification-gateway.gateway';

@Module({
  providers: [NotificationGatewayGateway],
  exports: [NotificationGatewayGateway],
})
export class NotificationGatewayModule {}
