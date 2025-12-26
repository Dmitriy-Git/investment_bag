import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Конфигурация для T-Invest API
 * Читает настройки из переменных окружения через ConfigService
 */
@Injectable()
export class TInvestConfig {
  private readonly apiUrl: string;
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl =
      this.configService.get<string>('T_INVEST_API_URL') || '';
    this.apiToken = this.configService.get<string>('T_INVEST_API_TOKEN') || '';

    this.validateConfig();
  }

  /**
   * Валидация обязательных параметров конфигурации
   * @throws Error если обязательные параметры отсутствуют
   */
  private validateConfig(): void {
    if (!this.apiToken || this.apiToken.trim() === '') {
      throw new Error(
        'T_INVEST_API_TOKEN is required in environment variables',
      );
    }
  }

  /**
   * Получить базовый URL API
   * @returns Базовый URL для T-Invest API
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Получить токен доступа
   * @returns API токен для аутентификации
   */
  getApiToken(): string {
    return this.apiToken;
  }

  /**
   * Получить заголовки для HTTP запросов
   * @returns Объект с заголовками для запросов к API
   */
  getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
}

