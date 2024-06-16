import { z } from 'zod';

export const createGroupValidation = z.object({
  name: z.string(),
  projectId: z.number(),
  color: z.string().nullable(),
});

export const assignGroupValidation = z.object({
  groupId: z.number(),
  memberId: z.number(),
  projectId: z.number(),
});

export type AssingGroupDto = z.infer<typeof assignGroupValidation>;

export const unAsignGroupValidation = z.object({
  groupId: z.number(),
  memberId: z.number(),
});

export type UnAssingGroupDto = z.infer<typeof unAsignGroupValidation>;
