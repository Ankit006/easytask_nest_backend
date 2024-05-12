import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class NotificationGatewayGateway {
  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
