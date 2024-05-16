import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { UsersModule } from 'src/users/users.module';
import { NotificationGatewayModule } from 'src/notification-gateway/notification-gateway.module';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [UsersModule, NotificationGatewayModule],
})
export class MembersModule {}
