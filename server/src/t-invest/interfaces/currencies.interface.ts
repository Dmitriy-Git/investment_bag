/**
 * Интерфейсы для работы с валютами T-Invest API
 * Документация: https://developer.tbank.ru/invest/api/instruments-service-currencies
 */

import {
  InstrumentStatus,
  InstrumentExchange,
} from './common.interface';
import { PaginationParams } from '../../common/pagination.interface';

/**
 * Параметры запроса списка валют
 */
export interface GetCurrenciesRequest extends PaginationParams {
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

/**
 * Параметры запроса получения одной валюты
 */
export interface GetCurrencyByRequest {
  idType: string;
  id: string;
  classCode?: string;
}

/**
 * Ответ API с информацией об одной валюте
 */
export interface GetCurrencyByResponse {
  instrument: Currency;
}
