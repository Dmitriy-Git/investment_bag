/**
 * Реэкспорт типов T-Invest API из сгенерированного файла
 */
import type { components, operations } from './api.types';

// Типы инструментов
export type Currency = components['schemas']['CurrencyDto'];
export type Bond = components['schemas']['BondDto'];
export type Share = components['schemas']['ShareDto'];
export type Instrument = components['schemas']['InstrumentDto'];

// Ответы API
export type FindInstrumentResponse = components['schemas']['FindInstrumentResponseDto'];

// Типы для query параметров
export type InstrumentStatus = NonNullable<
  operations['TInvestController_getCurrencies']['parameters']['query']
>['instrumentStatus'];

export type InstrumentExchange = NonNullable<
  operations['TInvestController_getCurrencies']['parameters']['query']
>['instrumentExchange'];

export type InstrumentIdType = NonNullable<
  operations['TInvestController_getCurrencyBy']['parameters']['query']
>['idType'];

export type InstrumentKind = NonNullable<
  operations['TInvestController_findInstrument']['parameters']['query']
>['instrumentKind'];

// Константы для enum-подобных типов
export const INSTRUMENT_STATUS = {
  UNSPECIFIED: 'INSTRUMENT_STATUS_UNSPECIFIED',
  BASE: 'INSTRUMENT_STATUS_BASE',
  ALL: 'INSTRUMENT_STATUS_ALL',
} as const;

export const INSTRUMENT_EXCHANGE = {
  UNSPECIFIED: 'INSTRUMENT_EXCHANGE_UNSPECIFIED',
  DEALER: 'INSTRUMENT_EXCHANGE_DEALER',
} as const;

export const INSTRUMENT_ID_TYPE = {
  UNSPECIFIED: 'INSTRUMENT_ID_UNSPECIFIED',
  FIGI: 'INSTRUMENT_ID_TYPE_FIGI',
  TICKER: 'INSTRUMENT_ID_TYPE_TICKER',
  UID: 'INSTRUMENT_ID_TYPE_UID',
  POSITION_UID: 'INSTRUMENT_ID_TYPE_POSITION_UID',
} as const;

export const INSTRUMENT_KIND = {
  UNSPECIFIED: 'INSTRUMENT_TYPE_UNSPECIFIED',
  BOND: 'INSTRUMENT_TYPE_BOND',
  SHARE: 'INSTRUMENT_TYPE_SHARE',
  CURRENCY: 'INSTRUMENT_TYPE_CURRENCY',
  ETF: 'INSTRUMENT_TYPE_ETF',
  FUTURES: 'INSTRUMENT_TYPE_FUTURES',
  OPTION: 'INSTRUMENT_TYPE_OPTION',
  SP: 'INSTRUMENT_TYPE_SP',
  WARRANT: 'INSTRUMENT_TYPE_WARRANT',
  CLEARING_CERTIFICATE: 'INSTRUMENT_TYPE_CLEARING_CERTIFICATE',
} as const;
