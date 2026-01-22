import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TInvestConfig } from "./t-invest.config";
import {
  InstrumentIdType,
  InstrumentStatus,
  InstrumentExchange,
} from "./interfaces";
import { PaginatedResponse } from "../common/pagination.interface";
import {
  GetCurrenciesQueryDto,
  GetCurrenciesResponseDto,
  GetCurrencyByResponseDto,
  CurrencyDto,
  GetBondsQueryDto,
  GetBondsResponseDto,
  GetBondByResponseDto,
  BondDto,
  GetSharesQueryDto,
  GetSharesResponseDto,
  GetShareByResponseDto,
  ShareDto,
  FindInstrumentQueryDto,
  FindInstrumentResponseDto,
} from "./dto";

/**
 * Параметры запроса инструмента по идентификатору
 */
interface GetInstrumentByParams {
  id: string;
  idType?: InstrumentIdType;
  classCode?: string;
}

/**
 * Сервис для работы с T-Invest API
 */
@Injectable()
export class TInvestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: TInvestConfig
  ) {}

  /**
   * Подготовить пагинированный ответ
   */
  private static prepareInstrumentsResponse<T>(
    data: T[],
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedInstruments = data.slice(startIndex, endIndex);

    return {
      results: paginatedInstruments,
      count: totalItems,
      next: page < totalPages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };
  }

  /**
   * Получить список валют
   */
  async getCurrencies(
    params?: GetCurrenciesQueryDto
  ): Promise<PaginatedResponse<CurrencyDto>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Currencies`;
    const headers = this.config.getHeaders();

    const requestBody = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    const response = await firstValueFrom(
      this.httpService.post<GetCurrenciesResponseDto>(url, requestBody, {
        headers,
      })
    );

    return TInvestService.prepareInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить информацию об одной валюте по идентификатору
   */
  async getCurrencyBy(params: GetInstrumentByParams): Promise<CurrencyDto> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/CurrencyBy`;
    const headers = this.config.getHeaders();

    const requestBody = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetCurrencyByResponseDto>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Получить список облигаций
   */
  async getBonds(
    params?: GetBondsQueryDto
  ): Promise<PaginatedResponse<BondDto>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 100;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Bonds`;
    const headers = this.config.getHeaders();

    const requestBody = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    const response = await firstValueFrom(
      this.httpService.post<GetBondsResponseDto>(url, requestBody, {
        headers,
      })
    );

    return TInvestService.prepareInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить информацию об одной облигации по идентификатору
   */
  async getBondBy(params: GetInstrumentByParams): Promise<BondDto> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/BondBy`;
    const headers = this.config.getHeaders();

    const requestBody = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetBondByResponseDto>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Получить список акций
   */
  async getShares(
    params?: GetSharesQueryDto
  ): Promise<PaginatedResponse<ShareDto>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;

    const url = `${this.config.getApiUrl()}.InstrumentsService/Shares`;
    const headers = this.config.getHeaders();

    const requestBody = {
      instrumentStatus:
        params?.instrumentStatus || InstrumentStatus.UNSPECIFIED,
      instrumentExchange:
        params?.instrumentExchange || InstrumentExchange.UNSPECIFIED,
    };

    const response = await firstValueFrom(
      this.httpService.post<GetSharesResponseDto>(url, requestBody, {
        headers,
      })
    );

    return TInvestService.prepareInstrumentsResponse(
      response.data.instruments,
      page,
      limit
    );
  }

  /**
   * Получить информацию об одной акции по идентификатору
   */
  async getShareBy(params: GetInstrumentByParams): Promise<ShareDto> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/ShareBy`;
    const headers = this.config.getHeaders();

    const requestBody = {
      idType: params.idType || InstrumentIdType.UID,
      id: params.id,
      ...(params.classCode && { classCode: params.classCode }),
    };

    const response = await firstValueFrom(
      this.httpService.post<GetShareByResponseDto>(url, requestBody, {
        headers,
      })
    );

    return response.data.instrument;
  }

  /**
   * Поиск инструментов по запросу
   */
  async findInstrument(
    params: FindInstrumentQueryDto
  ): Promise<FindInstrumentResponseDto> {
    const url = `${this.config.getApiUrl()}.InstrumentsService/FindInstrument`;
    const headers = this.config.getHeaders();

    const requestBody = {
      query: params.query,
      ...(params.instrumentKind && { instrumentKind: params.instrumentKind }),
    };

    const response = await firstValueFrom(
      this.httpService.post<FindInstrumentResponseDto>(url, requestBody, {
        headers,
      })
    );

    return { instruments: response.data.instruments };
  }
}
