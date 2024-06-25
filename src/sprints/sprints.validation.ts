import { z } from 'zod';

export const sprintFormValidation = z.object({
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
  projectId: z.number(),
  title: z.string(),
});

export const UpdateSprintFormValidation = z.object({
  id: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
  title: z.string(),
});

export const assingBacklogValidation = z.object({
  sprintId: z.number(),
  backlogId: z.number(),
});

export type AssingBacklogDto = z.infer<typeof assingBacklogValidation>;
