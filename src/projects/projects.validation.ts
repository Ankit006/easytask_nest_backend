import { z } from 'zod';

export const createProjectsValidation = z.object({
  title: z.string(),
  description: z.string(),
});

export type CreateProjectDto = z.infer<typeof createProjectsValidation>;
