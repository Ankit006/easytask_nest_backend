import {
  ConflictException,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
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

export function handleExceptionThrow(error: any) {
  if (error.response && error.response.error) {
    if (error.response.error === 'Conflict') {
      throw new ConflictException(error.response.message);
    } else if (error.response.error === 'Not Found') {
      throw new NotAcceptableException(error.response.message);
    } else if (error.response.error === 'Unauthorized') {
      throw new UnauthorizedException(error.response.message);
    } else {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: error },
      );
    }
  }
  throw new InternalServerErrorException('Something went wrong in the server', {
    cause: error,
  });
}
