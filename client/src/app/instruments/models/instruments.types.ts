import type { Share, Bond, Currency } from '../../models/t-invest.model';

/**
 * Тип категории инструментов
 */
export type InstrumentCategory = 'shares' | 'bonds' | 'currencies';

/**
 * Объединенный тип инструмента
 */
export type InstrumentItem = Share | Bond | Currency;

/**
 * Интерфейс для отображения в таблице
 */
export interface InstrumentRow {
  uid: string;
  ticker: string;
  name: string;
  currency: string;
  lot: number;
  tradingStatus: string;
  sector?: string;
}

/**
 * Названия категорий для отображения
 */
export const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  shares: 'Акции',
  bonds: 'Облигации',
  currencies: 'Валюты',
};

/**
 * Колонки таблицы по категориям
 */
export const COLUMNS_BY_CATEGORY: Record<InstrumentCategory, string[]> = {
  shares: ['uid', 'ticker', 'name', 'sector', 'currency', 'lot', 'tradingStatus'],
  bonds: ['uid', 'ticker', 'name', 'currency', 'lot', 'tradingStatus'],
  currencies: ['uid', 'ticker', 'name', 'currency', 'lot', 'tradingStatus'],
};
