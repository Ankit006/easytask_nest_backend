import { z } from 'zod';

export const memberInviteValidation = z.object({
  userId: z.number(),
  projectId: z.number(),
});
export type MemberInviteDto = z.infer<typeof memberInviteValidation>;
