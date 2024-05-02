import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { customProvier } from 'src/constants';

@Injectable()
export class CacheService {
  constructor(
    @Inject(customProvier.REDIS_CLIENT) private redis: RedisClientType,
  ) {}

  async store(name: string, key: string, value: string) {
    try {
      await this.redis.hSet(name, key, value);
    } catch (err) {
      throw new Error('Something went wrong in the server');
    }
  }

  async get(name: string, key: string) {
    try {
      const res = await this.redis.hGet(name, key);
      return res;
    } catch (err) {
      throw new Error('Something went wrong in the server');
    }
  }

  async remove(name: string, key: string) {
    try {
      await this.redis.hDel(name, key);
    } catch {
      throw new Error('Something went wrong in the server');
    }
  }
}
