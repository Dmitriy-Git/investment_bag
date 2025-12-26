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

