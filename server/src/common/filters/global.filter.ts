import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionRes = exception?.getResponse?.() as { message: string[] };
    const responseBody = {
      code: httpStatus,
      message: exceptionRes?.message?.join
        ? exceptionRes?.message?.join(',')
        : exception.message,
    };

    httpAdapter.reply(response, responseBody, HttpStatus.OK);
  }
}
