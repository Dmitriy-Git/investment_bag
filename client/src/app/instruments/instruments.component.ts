import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  resource,
  linkedSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { InstrumentsService, PaginatedResponse } from './services';
import { InstrumentsStateService } from './services/instruments-state.service';
import { CategoryToggleComponent, InstrumentsTableComponent } from './components';
import type { InstrumentCategory, InstrumentItem } from './models';

/**
 * Компонент страницы инструментов
 */
@Component({
  selector: 'app-instruments',
  imports: [
    MatButtonModule,
    MatIconModule,
    CategoryToggleComponent,
    InstrumentsTableComponent,
  ],
  templateUrl: './instruments.component.html',
  styleUrl: './instruments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentsComponent {
  private readonly instrumentsService = inject(InstrumentsService);
  private readonly stateService = inject(InstrumentsStateService);

  /** Выбранная категория инструментов */
  readonly selectedCategory = signal<InstrumentCategory>('shares');

  /** Текущая страница (1-based для API), сбрасывается при смене категории */
  readonly currentPage = linkedSignal({
    source: this.selectedCategory,
    computation: () => 1,
  });

  /** Количество элементов на странице, сбрасывается при смене категории */
  readonly pageSize = linkedSignal({
    source: this.selectedCategory,
    computation: () => 10,
  });

  /** Ресурс для загрузки данных */
  readonly instrumentsResource = resource({
    params: () => ({
      category: this.selectedCategory(),
      page: this.currentPage(),
      limit: this.pageSize(),
    }),
    loader: ({ params }): Promise<PaginatedResponse<InstrumentItem>> => {
      const requestParams = { page: params.page, limit: params.limit };

      switch (params.category) {
        case 'shares':
          return firstValueFrom(this.instrumentsService.getShares(requestParams)) as Promise<
            PaginatedResponse<InstrumentItem>
          >;
        case 'bonds':
          return firstValueFrom(this.instrumentsService.getBonds(requestParams)) as Promise<
            PaginatedResponse<InstrumentItem>
          >;
        case 'currencies':
          return firstValueFrom(this.instrumentsService.getCurrencies(requestParams)) as Promise<
            PaginatedResponse<InstrumentItem>
          >;
      }
    },
  });

  /** Computed signals через state service */
  readonly isLoading = this.stateService.createIsLoadingSignal(this.instrumentsResource);
  readonly errorMessage = this.stateService.createErrorMessageSignal(this.instrumentsResource);
  readonly tableData = this.stateService.createTableDataSignal(this.instrumentsResource);
  readonly totalCount = this.stateService.createTotalCountSignal(this.instrumentsResource);
  readonly displayedColumns = this.stateService.createDisplayedColumnsSignal(this.selectedCategory);

  /**
   * Обработчик смены категории
   */
  onCategoryChange(category: InstrumentCategory): void {
    this.selectedCategory.set(category);
  }

  /**
   * Обработчик смены страницы
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  /**
   * Перезагрузить данные
   */
  reload(): void {
    this.instrumentsResource.reload();
  }
}
