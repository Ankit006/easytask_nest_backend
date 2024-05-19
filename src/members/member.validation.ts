import { z } from 'zod';

export const memberInviteValidation = z.object({
  user_id: z.number(),
  project_id: z.number(),
});
export type MemberInviteDto = z.infer<typeof memberInviteValidation>;
