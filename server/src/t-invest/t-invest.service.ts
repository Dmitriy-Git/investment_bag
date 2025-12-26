import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TInvestConfig } from './t-invest.config';
import { HttpErrorHandlerService } from '../common/http-error-handler.service';
import {
  GetCurrenciesRequest,
  GetCurrenciesResponse,
} from './interfaces/currencies.interface';
import {
  InstrumentStatus,
  InstrumentExchange,
} from './interfaces/common.interface';

/**
 * Сервис для работы с T-Invest API
 */
@Injectable()
export class TInvestService {
  private readonly logger = new Logger(TInvestService.name);
 
  constructor(
    private readonly httpService: HttpService,
    private readonly config: TInvestConfig,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {}

  /**
   * Получить список валют
   * @param params Параметры запроса (опционально)
   * @returns Список валют
   * @throws HttpException при ошибке запроса к API
   */
  async getCurrencies(
    params?: GetCurrenciesRequest,
  ): Promise<GetCurrenciesResponse> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/Currencies`;
    const headers = this.config.getHeaders();

    const requestBody: GetCurrenciesRequest = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    try {
      this.logger.debug(`Making POST request to ${url}`);

      const response = await firstValueFrom(
        this.httpService.post<GetCurrenciesResponse>(url, requestBody, {
          headers,
        }),
      );

      return response.data;
    } catch (error) {
      this.errorHandler.handleError(error, url, 'T-Invest API');
    }
  }
}
