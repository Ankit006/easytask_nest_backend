import { UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CacheService } from 'src/cache/cache.service';
import { SocketEvent } from 'src/constants';
import { NotificationGatewayExceptionFilter } from './notification-gateway.exception';
import { validateSocketAuth } from './notification-gateway.validation';

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

  async sendNotification(
    userId: number | string,
    event: SocketEvent,
    message: string,
  ) {
    this.io.to(userId.toString()).emit(event, message);
  }
}
