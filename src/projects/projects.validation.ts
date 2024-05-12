import { z } from 'zod';

export const createProjectsValidation = z.object({
  title: z.string(),
  description: z.string(),
});

export const updateProjectValidation = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
});

export const removeProjectValidation = z.object({
  id: z.number(),
});

export const projectIdValidate = z.string().transform((val, ctx) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Not a valid project',
    });
    return z.never;
  }
  return parsed;
});
