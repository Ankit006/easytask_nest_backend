import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// This is exception handler is for formatting moongose error when information
// with same unique key already exist

@Catch(HttpException)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.response && exception.response.error) {
      if (exception.response.error.code === 11000) {
        const uniqueKeys = exception.response.error.keyPattern as Record<
          string,
          number
        >;
        const uniqueKeysList = Object.keys(uniqueKeys);
        let errorMessage = 'Information with this ';

        for (let x = 0; x < uniqueKeysList.length; x++) {
          if (x !== uniqueKeysList.length - 1) {
            errorMessage += `${uniqueKeysList[x]},`;
          } else {
            errorMessage += `${uniqueKeysList[x]}`;
          }
        }

        errorMessage = errorMessage + ' already exist';
        response.status(HttpStatus.CONFLICT).json({ message: errorMessage });
      } else {
        response.status(exception.status).send(exception);
      }
    } else {
      response.status(exception.status).send(exception);
    }
  }
}
