import { z } from 'zod';

export const createUserValidation = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserValidation>;
