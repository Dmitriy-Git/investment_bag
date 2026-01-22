/**
 * Общие типы и перечисления для T-Invest API
 * Используются во всех сервисах API
 */

/**
 * Статус инструмента
 * Используется для фильтрации инструментов по статусу доступности
 */
export enum InstrumentStatus {
  UNSPECIFIED = 'INSTRUMENT_STATUS_UNSPECIFIED',
  BASE = 'INSTRUMENT_STATUS_BASE',
  ALL = 'INSTRUMENT_STATUS_ALL',
}

/**
 * Тип биржи
 * Используется для фильтрации инструментов по площадке торговли
 */
export enum InstrumentExchange {
  UNSPECIFIED = 'INSTRUMENT_EXCHANGE_UNSPECIFIED',
  DEALER = 'INSTRUMENT_EXCHANGE_DEALER',
}

/**
 * Тип идентификатора инструмента
 * Используется для указания способа идентификации инструмента
 */
export enum InstrumentIdType {
  UNSPECIFIED = 'INSTRUMENT_ID_UNSPECIFIED',
  FIGI = 'INSTRUMENT_ID_TYPE_FIGI',
  TICKER = 'INSTRUMENT_ID_TYPE_TICKER',
  UID = 'INSTRUMENT_ID_TYPE_UID',
  POSITION_UID = 'INSTRUMENT_ID_TYPE_POSITION_UID',
}

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
