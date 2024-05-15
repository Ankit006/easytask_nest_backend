import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { validateSocketAuth } from './notification-gateway.validation';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class NotificationGatewayGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket = context.switchToWs().getClient() as Socket;
    const validData = validateSocketAuth.safeParse(socket.handshake.auth);
    if (validData.success) {
      return true;
    } else {
      throw new WsException('You are not permitted');
    }
  }
}
