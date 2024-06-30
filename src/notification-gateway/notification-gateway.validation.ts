import { z } from 'zod';

export const validateSocketAuth = z.object({
  userId: z.number(),
});
