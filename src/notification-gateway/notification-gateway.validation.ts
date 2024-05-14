import { z } from 'zod';

export const validateSocketAuth = z.object({
  user_id: z.string().transform((input) => {
    const parsedValue = parseInt(input, 10);
    if (isNaN(parsedValue)) {
      throw new Error('Invalid numeric string');
    }
    return parsedValue;
  }),
});
