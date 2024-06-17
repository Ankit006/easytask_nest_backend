import { z } from 'zod';

export const userStoryDtoValidation = z.object({
  title: z.string(),
  description: z.string(),
  estimateDate: z.string(),
  priority: z.string(),
  projectId: z.number(),
  sprintId: z.number().optional(),
});

export const userStoryUpdateValidation = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  estimateDate: z.string(),
  priority: z.string(),
  sprintId: z.number().optional(),
});
