import { Module } from '@nestjs/common';
import { UserStoriesController } from './user-stories.controller';
import { UserStoriesService } from './user-stories.service';
import { MembersModule } from 'src/members/members.module';

@Module({
  controllers: [UserStoriesController],
  providers: [UserStoriesService],
  imports: [MembersModule],
})
export class UserStoriesModule {}
