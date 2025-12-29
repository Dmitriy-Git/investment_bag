/**
 * Общие интерфейсы для пагинации
 */

/**
 * Параметры пагинации запроса
 */
export interface PaginationParams {
  /**
   * Номер страницы (начинается с 1)
   * @default 1
   */
  page?: number;

  /**
   * Количество элементов на странице
   * @default 10
   */
  limit?: number;
}

/**
 * Пагинированный ответ
 */
export interface PaginatedResponse<T> {
  /**
   * Данные текущей страницы
   */
  results: T[];
  /**
   * Общее количество элементов
   */
  count: number;
  /**
   * Номер следующей страницы
   */
  next: number | null;
  /**
   * Номер предыдущей страницы
   */
  prev: number | null;
}

