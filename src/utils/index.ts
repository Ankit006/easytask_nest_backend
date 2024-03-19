import { ZodIssue } from 'zod';

export function zodErrorFormatter(errors: ZodIssue[]) {
  const newErrorObj: {
    [key: string | number]: string;
  } = {};
  for (const error of errors) {
    newErrorObj[error.path[0]] = error.message;
  }
  return { message: newErrorObj };
}
