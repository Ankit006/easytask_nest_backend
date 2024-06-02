import { z } from 'zod';

export const validateSocketAuth = z.object({
  user_id: z.number(),
});
