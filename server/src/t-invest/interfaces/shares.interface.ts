/**
 * Интерфейсы для работы с акциями T-Invest API
 * Документация: https://developer.tbank.ru/invest/api/instruments-service-shares
 */

import {
  InstrumentStatus,
  InstrumentExchange,
} from './common.interface';
import { PaginationParams } from '../../common/pagination.interface';

/**
 * Параметры запроса списка акций
 */
export interface GetSharesRequest extends PaginationParams {
  instrumentStatus?: InstrumentStatus;
  instrumentExchange?: InstrumentExchange;
}

/**
 * Акция
 */
export interface Share {
  figi: string;
  ticker: string;
  classCode: string;
  isin: string;
  lot: number;
  currency: string;
  name: string;
  exchange: string;
  ipoDate: string;
  issueSize: number;
  countryOfRisk: string;
  countryOfRiskName: string;
  sector: string;
  shareType: string;
  tradingStatus: string;
  otcFlag: boolean;
  buyAvailableFlag: boolean;
  sellAvailableFlag: boolean;
  divYieldFlag: boolean;
  shareKind: string;
  minPriceIncrement: number;
  apiTradeAvailableFlag: boolean;
  uid: string;
  realExchange: string;
  positionUid: string;
  forIisFlag: boolean;
  forQualInvestorFlag: boolean;
  weekendFlag: boolean;
  blockedTcaFlag: boolean;
  firstMinPriceIncrement: number;
  firstMinQuantity: number;
  riskLevel: string;
}

/**
 * Ответ API со списком акций
 */
export interface GetSharesResponse {
  instruments: Share[];
}

/**
 * Параметры запроса получения одной акции
 */
export interface GetShareByRequest {
  idType: string;
  id: string;
  classCode?: string;
}

/**
 * Ответ API с информацией об одной акции
 */
export interface GetShareByResponse {
  instrument: Share;
}

