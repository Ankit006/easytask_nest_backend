import { z } from 'zod';

export const taskCommentvalidation = z.object({
  id: z.number(),
  commnet: z.string(),
  taskId: z.number(),
});
