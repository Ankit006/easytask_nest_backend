import { z } from 'zod';

export const SignUpBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
});

export type SignupBodyDto = z.infer<typeof SignUpBodySchema>;
