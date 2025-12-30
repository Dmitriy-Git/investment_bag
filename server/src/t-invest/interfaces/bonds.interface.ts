/**
 * Интерфейсы для работы с облигациями T-Invest API
 * Документация: https://developer.tbank.ru/invest/api/instruments-service-bonds
 */

import {
  InstrumentStatus,
  InstrumentExchange,
} from './common.interface';
import { PaginationParams } from '../../common/pagination.interface';

/**
 * Параметры запроса списка облигаций
 */
export interface GetBondsRequest extends PaginationParams {
  instrumentStatus?: InstrumentStatus;
  instrumentExchange?: InstrumentExchange;
}

/**
 * Облигация
 */
export interface Bond {
  figi: string;
  ticker: string;
  classCode: string;
  isin: string;
  lot: number;
  currency: string;
  name: string;
  exchange: string;
  couponQuantityPerYear: number;
  maturityDate: string;
  nominal: number;
  stateRegDate: string;
  placementDate: string;
  placementPrice: number;
  aciValue: number;
  countryOfRisk: string;
  countryOfRiskName: string;
  sector: string;
  issueKind: string;
  issueSize: number;
  issueSizePlan: number;
  tradingStatus: string;
  otcFlag: boolean;
  buyAvailableFlag: boolean;
  sellAvailableFlag: boolean;
  floatingCouponFlag: boolean;
  perpetualFlag: boolean;
  amortizationFlag: boolean;
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
 * Ответ API со списком облигаций
 */
export interface GetBondsResponse {
  instruments: Bond[];
}

/**
 * Параметры запроса получения одной облигации
 */
export interface GetBondByRequest {
  idType: string;
  id: string;
  classCode?: string;
}

/**
 * Ответ API с информацией об одной облигации
 */
export interface GetBondByResponse {
  instrument: Bond;
}

