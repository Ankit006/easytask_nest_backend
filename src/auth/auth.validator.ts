import { z } from 'zod';

export const createUserValidation = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserValidation>;

export const loginUserValidation = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginUserDto = z.infer<typeof loginUserValidation>;
