import { Injectable, computed, type Signal } from '@angular/core';
import type { PaginatedResponse } from './instruments.service';
import type {
  InstrumentItem,
  InstrumentRow,
  InstrumentCategory,
} from '../models';
import { COLUMNS_BY_CATEGORY } from '../models';

/**
 * Тип ресурса инструментов с необходимыми методами
 */
type InstrumentsResource = {
  isLoading(): boolean;
  error(): Error | undefined;
  hasValue(): boolean;
  value(): PaginatedResponse<InstrumentItem> | undefined;
};

/**
 * Сервис для управления состоянием страницы инструментов.
 * Инкапсулирует логику создания computed signals и трансформации данных.
 */
@Injectable({
  providedIn: 'root',
})
export class InstrumentsStateService {
  /**
   * Создает computed signal для состояния загрузки
   */
  createIsLoadingSignal(resource: InstrumentsResource): Signal<boolean> {
    return computed(() => resource.isLoading());
  }

  /**
   * Создает computed signal для сообщения об ошибке
   */
  createErrorMessageSignal(resource: InstrumentsResource): Signal<string | null> {
    return computed(() => {
      const error = resource.error();
      return error ? 'Не удалось загрузить данные. Попробуйте позже.' : null;
    });
  }

  /**
   * Создает computed signal для данных таблицы
   */
  createTableDataSignal(resource: InstrumentsResource): Signal<InstrumentRow[]> {
    return computed(() => {
      const response = resource.value();
      if (!response?.results) return [];
      return response.results.map((item) => this.mapToRow(item));
    });
  }

  /**
   * Создает computed signal для общего количества элементов
   */
  createTotalCountSignal(resource: InstrumentsResource): Signal<number> {
    return computed(() => {
      const response = resource.value();
      return response?.count ?? 0;
    });
  }

  /**
   * Создает computed signal для колонок таблицы
   */
  createDisplayedColumnsSignal(
    categorySignal: Signal<InstrumentCategory>
  ): Signal<string[]> {
    return computed(() => COLUMNS_BY_CATEGORY[categorySignal()]);
  }

  /**
   * Получить CSS класс для статуса торговли
   */
  getStatusClass(status: string): string {
    if (status.includes('NORMAL_TRADING')) return 'status-active';
    if (status.includes('NOT_AVAILABLE')) return 'status-inactive';
    return 'status-default';
  }

  /**
   * Получить читаемое название статуса
   */
  getStatusLabel(status: string): string {
    if (status.includes('NORMAL_TRADING')) return 'Торгуется';
    if (status.includes('NOT_AVAILABLE')) return 'Недоступен';
    if (status.includes('BREAK')) return 'Перерыв';
    if (status.includes('OPENING')) return 'Открытие';
    if (status.includes('CLOSING')) return 'Закрытие';
    return 'Неизвестно';
  }

  /**
   * Преобразовать инструмент в строку таблицы
   */
  private mapToRow(item: InstrumentItem): InstrumentRow {
    const row: InstrumentRow = {
      uid: 'uid' in item ? item.uid : '',
      ticker: item.ticker,
      name: item.name,
      currency: item.currency.toUpperCase(),
      lot: item.lot,
      tradingStatus: item.tradingStatus,
    };

    if ('sector' in item) {
      row.sector = item.sector;
    }

    return row;
  }
}
