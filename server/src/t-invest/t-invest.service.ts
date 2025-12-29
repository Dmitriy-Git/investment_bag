import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TInvestConfig } from "./t-invest.config";
import {
  Currency,
  GetCurrenciesRequest,
  GetCurrenciesResponse,
} from "./interfaces/currencies.interface";
import {
  Bond,
  GetBondsRequest,
  GetBondsResponse,
} from "./interfaces/bonds.interface";
import {
  InstrumentStatus,
  InstrumentExchange,
} from "./interfaces/common.interface";
import { PaginatedResponse } from "../common/pagination.interface";

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
  ): Promise<PaginatedResponse<Currency>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Currencies`;
    const headers = this.config.getHeaders();

    const requestBody: GetCurrenciesRequest = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    // Получаем все валюты от API
    const response = await firstValueFrom(
      this.httpService.post<GetCurrenciesResponse>(url, requestBody, {
        headers,
      })
    );

    const allInstruments = response.data.instruments;
    const totalItems = allInstruments.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Вычисляем индексы для текущей страницы
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Получаем элементы для текущей страницы
    const paginatedInstruments = allInstruments.slice(startIndex, endIndex);

    return {
      results: paginatedInstruments,
      count: totalItems,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };
  }

  /**
   * Получить список облигаций
   * @param params Параметры запроса (опционально)
   * @returns Список облигаций
   * @throws HttpException при ошибке запроса к API
   */
  async getBonds(
    params?: GetBondsRequest
  ): Promise<PaginatedResponse<Bond>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 100;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Bonds`;
    const headers = this.config.getHeaders();

    const requestBody: GetBondsRequest = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    // Получаем все облигации от API
    const response = await firstValueFrom(
      this.httpService.post<GetBondsResponse>(url, requestBody, {
        headers,
      })
    );

    const allInstruments = response.data.instruments;
    const totalItems = allInstruments.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Вычисляем индексы для текущей страницы
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Получаем элементы для текущей страницы
    const paginatedInstruments = allInstruments.slice(startIndex, endIndex);

    return {
      results: paginatedInstruments,
      count: totalItems,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };
  }
}
