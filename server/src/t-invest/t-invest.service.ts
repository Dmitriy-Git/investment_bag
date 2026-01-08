import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TInvestConfig } from "./t-invest.config";
import {
  Currency,
  GetCurrenciesRequest,
  GetCurrenciesResponse,
  GetCurrencyByRequest,
  GetCurrencyByResponse,
} from "./interfaces/currencies.interface";
import {
  Bond,
  GetBondsRequest,
  GetBondsResponse,
  GetBondByRequest,
  GetBondByResponse,
} from "./interfaces/bonds.interface";
import {
  Share,
  GetSharesRequest,
  GetSharesResponse,
  GetShareByRequest,
  GetShareByResponse,
} from "./interfaces/shares.interface";
import {
  InstrumentIdType,
  InstrumentStatus,
  InstrumentExchange,
} from "./interfaces/common.interface";
import {
  FindInstrumentRequest,
  FindInstrumentResponse,
} from "./interfaces/instruments.interface";
import { PaginatedResponse } from "../common/pagination.interface";

/**
 * Сервис для работы с T-Invest API
 */
@Injectable()
export class TInvestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: TInvestConfig
  ) {}

  static preparedInstrumentsResponse<T>(
    data: T[],
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const allInstruments = data;
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

    return TInvestService.preparedInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить список облигаций
   * @param params Параметры запроса (опционально)
   * @returns Список облигаций
   * @throws HttpException при ошибке запроса к API
   */
  async getBonds(params?: GetBondsRequest): Promise<PaginatedResponse<Bond>> {
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

    return TInvestService.preparedInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить список акций
   * @param params Параметры запроса (опционально)
   * @returns Список акций
   * @throws HttpException при ошибке запроса к API
   */
  async getShares(
    params?: GetSharesRequest
  ): Promise<PaginatedResponse<Share>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Shares`;
    const headers = this.config.getHeaders();

    const requestBody: GetSharesRequest = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    // Получаем все акции от API
    const response = await firstValueFrom(
      this.httpService.post<GetSharesResponse>(url, requestBody, {
        headers,
      })
    );

    return TInvestService.preparedInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить информацию об одной облигации по идентификатору
   * @param params Параметры запроса
   * @returns Информация об облигации
   * @throws HttpException при ошибке запроса к API
   */
  async getBondBy(params: GetBondByRequest): Promise<Bond> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/BondBy`;
    const headers = this.config.getHeaders();

    const requestBody: GetBondByRequest = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetBondByResponse>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Получить информацию об одной валюте по идентификатору
   * @param params Параметры запроса
   * @returns Информация о валюте
   * @throws HttpException при ошибке запроса к API
   */
  async getCurrencyBy(params: GetCurrencyByRequest): Promise<Currency> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/CurrencyBy`;
    const headers = this.config.getHeaders();

    const requestBody: GetCurrencyByRequest = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetCurrencyByResponse>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Получить информацию об одной акции по идентификатору
   * @param params Параметры запроса
   * @returns Информация об акции
   * @throws HttpException при ошибке запроса к API
   */
  async getShareBy(params: GetShareByRequest): Promise<Share> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/ShareBy`;
    const headers = this.config.getHeaders();

    const requestBody: GetShareByRequest = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetShareByResponse>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Поиск инструментов по запросу
   * @param params Параметры запроса поиска
   * @returns Список найденных инструментов
   * @throws HttpException при ошибке запроса к API
   */
  async findInstrument(
    params: FindInstrumentRequest
  ): Promise<FindInstrumentResponse> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/FindInstrument`;
    const headers = this.config.getHeaders();

    const requestBody: FindInstrumentRequest = {
      query: params.query,
      ...(params.instrumentKind && { instrumentKind: params.instrumentKind }),
    };

    const response = await firstValueFrom(
      this.httpService.post<FindInstrumentResponse>(url, requestBody, {
        headers,
      })
    );

    return { instruments: response.data.instruments };
  }
}
