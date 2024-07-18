import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { MembersModule } from 'src/members/members.module';

@Module({
  providers: [SprintsService],
  controllers: [SprintsController],
  imports: [MembersModule],
})
export class SprintsModule {}
