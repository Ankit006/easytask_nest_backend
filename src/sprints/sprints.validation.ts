import { z } from 'zod';

export const sprintFormValidation = z.object({
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
  projectId: z.number(),
  title: z.string(),
});
