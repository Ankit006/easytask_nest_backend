import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { CacheModule } from './cache/cache.module';
import { MembersModule } from './members/members.module';
import { SprintsModule } from './sprints/sprints.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    AuthModule,
    DatabaseModule,
    ProjectsModule,
    CacheModule,
    MembersModule,
    SprintsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
