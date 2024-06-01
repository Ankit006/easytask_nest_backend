import { z } from 'zod';

export const memberInviteValidation = z.object({
  user_id: z.number(),
  project_id: z.number(),
});
export type MemberInviteDto = z.infer<typeof memberInviteValidation>;

export const memberRoleUpdateValidation = z.object({
  member_id: z.number(),
  project_id: z.number(),
  role: z.string(),
});

export type MemberRoleUpdateDto = z.infer<typeof memberRoleUpdateValidation>;
