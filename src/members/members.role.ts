import { SetMetadata } from '@nestjs/common';

export const MemberRolesKey = 'memberRoles';

export type MemberRolesType = 'admin' | 'moderator';

export const MemberRoles = (...roles: MemberRolesType[]) =>
  SetMetadata(MemberRolesKey, roles);
