import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

/**
 * Сервис для обработки HTTP ошибок
 * Используется для унификации обработки ошибок при работе с внешними API
 */
@Injectable()
export class HttpErrorHandlerService {
  private readonly logger = new Logger(HttpErrorHandlerService.name);

  /**
   * Обработать ошибку HTTP запроса
   * @param error Ошибка, которую нужно обработать
   * @param url URL запроса, при котором произошла ошибка
   * @param serviceName Название сервиса для логирования (например, "T-Invest API")
   * @throws HttpException с детальной информацией об ошибке
   */
  handleError(error: unknown, url: string, serviceName: string = 'API'): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';

      this.logger.error(
        `${serviceName} error: ${message} (${status}) at ${url}`,
        error.response?.data,
      );

      throw new HttpException(
        {
          message: `${serviceName} error: ${message}`,
          statusCode: status,
          details: error.response?.data,
        },
        status,
      );
    }

    this.logger.error(`Unexpected error at ${url}`, error);
    throw new HttpException(
      `Unexpected error occurred while calling ${serviceName}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

