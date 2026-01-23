import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import type { InstrumentRow } from '../../models';
import { InstrumentsStateService } from '../../services/instruments-state.service';

/**
 * Компонент таблицы инструментов с пагинацией
 */
@Component({
  selector: 'app-instruments-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './instruments-table.component.html',
  styleUrl: './instruments-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentsTableComponent {
  readonly stateService = inject(InstrumentsStateService);

  /** Данные для отображения в таблице */
  readonly data = input.required<InstrumentRow[]>();

  /** Колонки для отображения */
  readonly columns = input.required<string[]>();

  /** Состояние загрузки */
  readonly isLoading = input.required<boolean>();

  /** Сообщение об ошибке */
  readonly errorMessage = input.required<string | null>();

  /** Общее количество элементов */
  readonly totalCount = input.required<number>();

  /** Размер страницы */
  readonly pageSize = input.required<number>();

  /** Индекс текущей страницы (0-based) */
  readonly pageIndex = input.required<number>();

  /** Событие смены страницы */
  readonly pageChange = output<PageEvent>();

  /** Событие повторной загрузки */
  readonly reload = output<void>();

  /**
   * Обработчик события пагинации
   */
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
   * Обработчик повторной загрузки
   */
  onReload(): void {
    this.reload.emit();
  }
}
