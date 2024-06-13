import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  MemberInviteDto,
  MemberRoleUpdateDto,
  memberInviteValidation,
  memberRoleUpdateValidation,
} from './member.validation';
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

  @Get('/user-search')
  @MemberRoles('admin')
  async searchUser(@Query() query: { email: string }, @Req() req) {
    return await this.memberService.searchUserByEmail(query.email, req);
  }

  @Get('/:projectId')
  @MemberRoles('admin', 'moderator')
  async members(@Param('projectId', ParseIntPipe) projectId: number) {
    return await this.memberService.getMembers(projectId);
  }

  @Post('/role')
  @MemberRoles('admin')
  @UsePipes(new ZodValidationPipe(memberRoleUpdateValidation))
  async changeRole(@Body() memberRoleUpdateDto: MemberRoleUpdateDto) {
    return await this.memberService.updateRole(memberRoleUpdateDto);
  }
}
