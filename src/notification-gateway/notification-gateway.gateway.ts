import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CacheService } from 'src/cache/cache.service';
import { redisCacheKey, socketEvent } from 'src/constants';
import { NotificationGatewayExceptionFilter } from './notification-gateway.exception';
import { validateSocketAuth } from './notification-gateway.validation';
import { IJoinNotification } from './notification.interface';

@WebSocketGateway({ cors: true })
@UseFilters(NotificationGatewayExceptionFilter)
export class NotificationGatewayGateway implements OnGatewayConnection {
  constructor(private cacheService: CacheService) {}
  @WebSocketServer()
  io: Socket;
  handleConnection(client: Socket) {
    const validAuth = validateSocketAuth.safeParse(client.handshake.auth);
    if (!validAuth.success) {
      client.disconnect(true);
    } else {
      client.join(validAuth.data.user_id.toString());
    }
  }

  async sendJoinNotification(
    userId: number,
    projectId: number,
    senderName: string,
  ) {
    const notification: IJoinNotification = {
      userId,
      projectId: projectId,
      senderName,
    };
    const stringify = JSON.stringify(notification);
    await this.cacheService.listPush(
      redisCacheKey(undefined, userId).notifications,
      stringify,
    );
    this.io.to(userId.toString()).emit(socketEvent.notifications, stringify);
  }
}
