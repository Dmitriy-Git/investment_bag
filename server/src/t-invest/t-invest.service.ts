import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TInvestConfig } from "./t-invest.config";
import {
  GetCurrenciesRequest,
  GetCurrenciesResponse,
} from "./interfaces/currencies.interface";
import {
  InstrumentStatus,
  InstrumentExchange,
} from "./interfaces/common.interface";

/**
 * Сервис для работы с T-Invest API
 */
@Injectable()
export class TInvestService {

  constructor(
    private readonly httpService: HttpService,
    private readonly config: TInvestConfig,
  ) {}

  /**
   * Получить список валют
   * @param params Параметры запроса (опционально)
   * @returns Список валют
   * @throws HttpException при ошибке запроса к API
   */
  async getCurrencies(
    params?: GetCurrenciesRequest
  ): Promise<GetCurrenciesResponse> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/Currencies`;
    const headers = this.config.getHeaders();

    const requestBody: GetCurrenciesRequest = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    const response = await firstValueFrom(
      this.httpService.post<GetCurrenciesResponse>(url, requestBody, {
        headers,
      })
    );

    return response.data;
  }
}
