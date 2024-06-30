import { z } from 'zod';

export const memberInviteValidation = z.object({
  userId: z.number(),
  projectId: z.number(),
});
export type MemberInviteDto = z.infer<typeof memberInviteValidation>;

export const memberRoleUpdateValidation = z.object({
  member_id: z.number(),
  projectId: z.number(),
  role: z.string(),
});

export type MemberRoleUpdateDto = z.infer<typeof memberRoleUpdateValidation>;
