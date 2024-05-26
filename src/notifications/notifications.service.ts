import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { redisCacheKey } from 'src/constants';

@Injectable()
export class NotificationsService {
  constructor(private cacheService: CacheService) {}

  async notifications(userId: string) {
    const res = await this.cacheService.getListValues(
      redisCacheKey(undefined, userId).notifications,
    );
    return res.length > 0 ? res.map((data) => JSON.parse(data)) : res;
  }

  async clearNotification(userId: string) {
    await this.cacheService.removeListCache(
      redisCacheKey(null, userId).notifications,
    );
    return { message: 'Notification is cleared' };
  }

  async clearSingleNotification(userId: string, stringifyNotification: string) {
    await this.cacheService.removeSingleFromList(
      redisCacheKey(null, userId).notifications,
      stringifyNotification,
    );
    return { message: 'Notification is removed' };
  }
}
