import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { MemberInviteDto, memberInviteValidation } from './member.validation';

@Controller('members')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get('/:projectId/member')
  async member(@Param('projectId') projectId: string, @Req() request: Request) {
    return await this.memberService.member(request, projectId);
  }

  @Post('/invite')
  @UsePipes(new ZodValidationPipe(memberInviteValidation))
  async invite(@Body() memberInviteDto: MemberInviteDto) {
    return this.memberService.invite(
      memberInviteDto.projectId,
      memberInviteDto.userId,
    );
  }
}
