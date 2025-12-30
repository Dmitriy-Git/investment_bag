/**
 * Интерфейсы для работы с поиском инструментов T-Invest API
 * Документация: https://developer.tbank.ru/invest/api/instruments-service-find-instrument
 */

/**
 * Тип инструмента
 */
export enum InstrumentKind {
  UNSPECIFIED = 'INSTRUMENT_TYPE_UNSPECIFIED',
  BOND = 'INSTRUMENT_TYPE_BOND',
  SHARE = 'INSTRUMENT_TYPE_SHARE',
  CURRENCY = 'INSTRUMENT_TYPE_CURRENCY',
  ETF = 'INSTRUMENT_TYPE_ETF',
  FUTURES = 'INSTRUMENT_TYPE_FUTURES',
  OPTION = 'INSTRUMENT_TYPE_OPTION',
  SP = 'INSTRUMENT_TYPE_SP',
  WARRANT = 'INSTRUMENT_TYPE_WARRANT',
  CLEARING_CERTIFICATE = 'INSTRUMENT_TYPE_CLEARING_CERTIFICATE',
}

/**
 * Параметры запроса поиска инструментов
 */
export interface FindInstrumentRequest {
  query: string;
  instrumentKind?: InstrumentKind;
}

/**
 * Базовый интерфейс инструмента (общие поля для всех типов)
 */
export interface Instrument {
  figi: string;
  ticker: string;
  classCode: string;
  isin?: string;
  lot: number;
  currency: string;
  name: string;
  exchange?: string;
  tradingStatus?: string;
  otcFlag?: boolean;
  buyAvailableFlag?: boolean;
  sellAvailableFlag?: boolean;
  apiTradeAvailableFlag?: boolean;
  uid: string;
  realExchange?: string;
  positionUid: string;
  forIisFlag?: boolean;
  forQualInvestorFlag?: boolean;
  weekendFlag?: boolean;
  blockedTcaFlag?: boolean;
  instrumentKind?: InstrumentKind;
}

/**
 * Ответ API с результатами поиска инструментов
 */
export interface FindInstrumentResponse {
  instruments: Instrument[];
}

