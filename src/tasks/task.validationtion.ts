import { z } from 'zod';

export const taskValidation = z.object({
  task: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  userStoryId: z.number(),
});
