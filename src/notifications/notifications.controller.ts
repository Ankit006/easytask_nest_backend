import { Body, Controller, Delete, Get, Put, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifcations(@Req() request: Request) {
    return this.notificationsService.notifications(request['user'].id);
  }

  @Put()
  async removeSingleNotification(
    @Body() notificationDto: { notification: string },
    @Req() reqeust: Request,
  ) {
    return this.notificationsService.clearSingleNotification(
      reqeust['user'].id,
      notificationDto.notification,
    );
  }

  @Delete()
  async clearNotification(@Req() request: Request) {
    return this.notificationsService.clearNotification(request['user'].id);
  }
}
