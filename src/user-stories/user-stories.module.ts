import { Module } from '@nestjs/common';
import { UserStoriesController } from './user-stories.controller';
import { UserStoriesService } from './user-stories.service';

@Module({
  controllers: [UserStoriesController],
  providers: [UserStoriesService],
})
export class UserStoriesModule {}
