import { z } from 'zod';

export const joinProjectValidation = z.object({
  project_id: z.number(),
  notification: z.string(),
});

export type JoinProjectDto = z.infer<typeof joinProjectValidation>;
