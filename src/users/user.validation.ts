import { z } from 'zod';

export const joinProjectValidation = z.object({
  projectId: z.number(),
  notification: z.string(),
});

export type JoinProjectDto = z.infer<typeof joinProjectValidation>;
