import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для логирования HTTP запросов
 * Логирует метод, URL, время выполнения и статус код ответа
 */
export function logger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Логируем начало запроса
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${ip}`);

  // Перехватываем событие завершения ответа для логирования результата
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;

    // Разные уровни логирования в зависимости от статус кода
    if (statusCode >= 500) {
      console.error(logMessage);
    } else if (statusCode >= 400) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next();
}
