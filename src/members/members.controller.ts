import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { MemberInviteDto, memberInviteValidation } from './member.validation';
import { MemberRoleGuard } from './members.guard';
import { MemberRoles } from './members.role';

@Controller('members')
@UseGuards(MemberRoleGuard)
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get('/:projectId/member')
  async member(@Param('projectId') projectId: string, @Req() request: Request) {
    return await this.memberService.member(request, projectId);
  }

  @Post('/invite')
  @UsePipes(new ZodValidationPipe(memberInviteValidation))
  @MemberRoles('admin')
  async invite(
    @Body() memberInviteDto: MemberInviteDto,
    @Req() request: Request,
  ) {
    return await this.memberService.invite(
      memberInviteDto.project_id,
      memberInviteDto.user_id,
      request,
    );
  }

  @Get('/search')
  @MemberRoles('admin')
  async searchUser(@Query() query: { email: string }) {
    return await this.memberService.searchUserByEmail(query.email);
  }
}
