/**
 * Интерфейсы для работы с валютами T-Invest API
 * Документация: https://developer.tbank.ru/invest/api/instruments-service-currencies
 */

import {
  InstrumentStatus,
  InstrumentExchange,
} from './common.interface';

/**
 * Параметры запроса списка валют
 */
export interface GetCurrenciesRequest {
  instrumentStatus?: InstrumentStatus;
  instrumentExchange?: InstrumentExchange;
}

/**
 * Валюта
 */
export interface Currency {
  figi: string;
  ticker: string;
  classCode: string;
  isin: string;
  lot: number;
  currency: string;
  name: string;
  nominal: number;
  tradingStatus: string;
  realExchange: string;
  positionUid: string;
  forIisFlag: boolean;
  forQualInvestorFlag: boolean;
  weekendFlag: boolean;
  blockedTcaFlag: boolean;
  apiTradeAvailableFlag: boolean;
}

/**
 * Ответ API со списком валют
 */
export interface GetCurrenciesResponse {
  instruments: Currency[];
}

