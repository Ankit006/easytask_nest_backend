import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { validateSocketAuth } from './notification-gateway.validation';

@WebSocketGateway()
export class NotificationGatewayGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    const validAuth = validateSocketAuth.safeParse(client.handshake.auth);
    if (!validAuth.success) {
      throw new WsException('Unbale to connect');
    } else {
      client.join(validAuth.data.user_id.toString());
    }
  }

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
