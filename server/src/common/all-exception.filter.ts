import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';

/**
 * Exception filter для обработки всех типов исключений
 * Перехватывает HttpException, AxiosError и другие ошибки
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: unknown = null;

    // Обработка HttpException
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message || message;
      details =
        typeof exceptionResponse === 'object' ? exceptionResponse : null;
    }
    // Обработка AxiosError (ошибки HTTP запросов)
    else if (exception instanceof AxiosError) {
      httpStatus = exception.response?.status || HttpStatus.BAD_GATEWAY;
      message =
        exception.response?.data?.message ||
        exception.message ||
        'External API error';
      details = exception.response?.data;

      this.logger.error(
        `Axios error: ${message} (${httpStatus}) at ${request.url}`,
        exception.response?.data,
      );
    }
    // Обработка обычных ошибок
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unexpected error: ${message} at ${request.url}`,
        exception.stack,
      );
    }

    const responseBody: {
      statusCode: number;
      timestamp: string;
      path: string;
      message: string;
      details?: unknown;
    } = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message,
    };

    if (details) {
      responseBody.details = details;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}