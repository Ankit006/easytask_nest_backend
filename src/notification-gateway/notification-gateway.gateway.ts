import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { validateSocketAuth } from './notification-gateway.validation';

@WebSocketGateway({ cors: true })
export class NotificationGatewayGateway implements OnGatewayConnection {
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

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    return body;
  }
}
