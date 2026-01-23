import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import type { InstrumentCategory } from '../../models';
import { CATEGORY_LABELS } from '../../models';

/**
 * Компонент переключателя категорий инструментов
 */
@Component({
  selector: 'app-category-toggle',
  imports: [MatButtonToggleModule],
  templateUrl: './category-toggle.component.html',
  styleUrl: './category-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryToggleComponent {
  /** Текущая выбранная категория */
  readonly selectedCategory = input.required<InstrumentCategory>();

  /** Событие смены категории */
  readonly categoryChange = output<InstrumentCategory>();

  /** Доступные категории для отображения */
  readonly categories: { value: InstrumentCategory; label: string }[] = [
    { value: 'shares', label: CATEGORY_LABELS.shares },
    { value: 'bonds', label: CATEGORY_LABELS.bonds },
    { value: 'currencies', label: CATEGORY_LABELS.currencies },
  ];

  /**
   * Обработчик смены категории
   */
  onCategoryChange(category: InstrumentCategory): void {
    this.categoryChange.emit(category);
  }
}
