import { z } from 'zod';

const FileFormField = z.object({
  type: z.string(),
  fieldname: z.string(),
  mimetype: z.string(),
  value: z.string(),
});

export const SignUpBodySchema = z.object({
  firstName: FileFormField,
  lastName: FileFormField,
  age: FileFormField,
  email: FileFormField,
  phoneNumber: FileFormField,
  password: FileFormField,
  file: z.any(),
});

export type SignupBodyDto = z.infer<typeof SignUpBodySchema>;
