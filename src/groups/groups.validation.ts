import { z } from 'zod';

export const createGroupValidation = z.object({
  name: z.string(),
  project_id: z.number(),
  color: z.string().nullable(),
});
