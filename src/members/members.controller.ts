import { Controller, Get, Param, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { Request } from 'express';

@Controller('members')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get('/:projectId/member')
  async member(@Param('projectId') projectId: string, @Req() request: Request) {
    return await this.memberService.member(request, projectId);
  }
}
