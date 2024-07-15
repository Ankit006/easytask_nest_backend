import { z } from 'zod';

export const taskValidation = z.object({
  task: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  userStoryId: z.number(),
});

export const changeTaskStatusValidation = z.object({
  taskId: z.number(),
  status: z.string(),
});

export type ChangeTaskStatusDto = z.infer<typeof changeTaskStatusValidation>;
