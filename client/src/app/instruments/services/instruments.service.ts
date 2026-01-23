import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  Currency,
  Bond,
  Share,
  FindInstrumentResponse,
  InstrumentStatus,
  InstrumentExchange,
  InstrumentIdType,
  InstrumentKind,
} from '../../models/t-invest.model';

/**
 * Пагинированный ответ от API
 */
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: number | null;
  prev: number | null;
}

/**
 * Параметры запроса списка инструментов
 */
export interface InstrumentListParams {
  page?: number;
  limit?: number;
  instrumentStatus?: InstrumentStatus;
  instrumentExchange?: InstrumentExchange;
}

/**
 * Параметры запроса инструмента по ID
 */
export interface InstrumentByIdParams {
  idType?: InstrumentIdType;
  classCode?: string;
}

/**
 * Параметры поиска инструментов
 */
export interface InstrumentSearchParams {
  query: string;
  instrumentKind?: InstrumentKind;
  apiTradeAvailableFlag?: boolean;
}

/**
 * Сервис для работы с инструментами T-Invest API
 */
@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 't-invest';

  /**
   * Получить список валют
   */
  getCurrencies(params?: InstrumentListParams): Observable<PaginatedResponse<Currency>> {
    const httpParams = this.buildListParams(params);
    return this.http.get<PaginatedResponse<Currency>>(
      `${this.baseUrl}/currencies`,
      { params: httpParams }
    );
  }

  /**
   * Получить валюту по идентификатору
   */
  getCurrencyById(id: string, params?: InstrumentByIdParams): Observable<Currency> {
    const httpParams = this.buildByIdParams(params);
    return this.http.get<Currency>(
      `${this.baseUrl}/currencies/${id}`,
      { params: httpParams }
    );
  }

  /**
   * Получить список облигаций
   */
  getBonds(params?: InstrumentListParams): Observable<PaginatedResponse<Bond>> {
    const httpParams = this.buildListParams(params);
    return this.http.get<PaginatedResponse<Bond>>(
      `${this.baseUrl}/bonds`,
      { params: httpParams }
    );
  }

  /**
   * Получить облигацию по идентификатору
   */
  getBondById(id: string, params?: InstrumentByIdParams): Observable<Bond> {
    const httpParams = this.buildByIdParams(params);
    return this.http.get<Bond>(
      `${this.baseUrl}/bonds/${id}`,
      { params: httpParams }
    );
  }

  /**
   * Получить список акций
   */
  getShares(params?: InstrumentListParams): Observable<PaginatedResponse<Share>> {
    const httpParams = this.buildListParams(params);
    return this.http.get<PaginatedResponse<Share>>(
      `${this.baseUrl}/shares`,
      { params: httpParams }
    );
  }

  /**
   * Получить акцию по идентификатору
   */
  getShareById(id: string, params?: InstrumentByIdParams): Observable<Share> {
    const httpParams = this.buildByIdParams(params);
    return this.http.get<Share>(
      `${this.baseUrl}/shares/${id}`,
      { params: httpParams }
    );
  }

  /**
   * Поиск инструментов по запросу
   */
  searchInstruments(params: InstrumentSearchParams): Observable<FindInstrumentResponse> {
    let httpParams = new HttpParams().set('query', params.query);

    if (params.instrumentKind) {
      httpParams = httpParams.set('instrumentKind', params.instrumentKind);
    }
    if (params.apiTradeAvailableFlag !== undefined) {
      httpParams = httpParams.set('apiTradeAvailableFlag', String(params.apiTradeAvailableFlag));
    }

    return this.http.get<FindInstrumentResponse>(
      `${this.baseUrl}/instruments/search`,
      { params: httpParams }
    );
  }

  /**
   * Построить параметры для запроса списка
   */
  private buildListParams(params?: InstrumentListParams): HttpParams {
    let httpParams = new HttpParams();

    if (params?.page) {
      httpParams = httpParams.set('page', String(params.page));
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', String(params.limit));
    }
    if (params?.instrumentStatus) {
      httpParams = httpParams.set('instrumentStatus', params.instrumentStatus);
    }
    if (params?.instrumentExchange) {
      httpParams = httpParams.set('instrumentExchange', params.instrumentExchange);
    }

    return httpParams;
  }

  /**
   * Построить параметры для запроса по ID
   */
  private buildByIdParams(params?: InstrumentByIdParams): HttpParams {
    let httpParams = new HttpParams();

    if (params?.idType) {
      httpParams = httpParams.set('idType', params.idType);
    }
    if (params?.classCode) {
      httpParams = httpParams.set('classCode', params.classCode);
    }

    return httpParams;
  }
}
