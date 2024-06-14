import { z } from 'zod';

export const userStoryDtoValidation = z.object({
  title: z.string(),
  description: z.string(),
  estimateDate: z.string(),
  status: z.string(),
  priority: z.string(),
  projectId: z.number(),
  sprintId: z.number(),
});
