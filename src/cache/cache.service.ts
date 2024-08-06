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

  async listPush(key: string, value: string) {
    try {
      await this.redis.lPush(key, value);
    } catch {
      throw new Error('Something went wrong in the server');
    }
  }

  async getListValues(key: string) {
    try {
      return await this.redis.lRange(key, 0, -1);
    } catch {
      throw new Error('Something went wrong in the server');
    }
  }

  async removeListCache(key: string) {
    try {
      await this.redis.del(key);
    } catch {
      throw new Error('Something went wrong in the server');
    }
  }
  async removeSingleFromList(key: string, stringifyValue: string) {
    try {
      await this.redis.lRem(key, 1, stringifyValue);
    } catch (err) {
      throw new Error('something went wrong in the server');
    }
  }
}
