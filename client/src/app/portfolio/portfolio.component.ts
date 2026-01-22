import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioStateService } from './services/portfolio-state.service';
import { PortfolioModalService } from './services/portfolio-modal.service';
import { USER_ID } from '../constants/user.constants';
import { AllocationChartComponent } from './components';

@Component({
  selector: 'app-portfolio',
  imports: [AllocationChartComponent, MatButtonModule, MatDialogModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  private readonly portfolioService = inject(PortfolioService);
  private readonly portfolioStateService = inject(PortfolioStateService);
  private readonly portfolioModalService = inject(PortfolioModalService);

  readonly userId = signal<number>(USER_ID);

  // resource реактивный, то есть при смене значения сигнала this.userId() будет выполнен новый запрос
  // также инициализирует запрос немедленно
  readonly portfolioResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params }) =>
      firstValueFrom(this.portfolioService.getPortfolio(params.userId)),
  });

  readonly isLoading = this.portfolioStateService.createIsLoadingSignal(
    this.portfolioResource
  );
  readonly errorMessage = this.portfolioStateService.createErrorMessageSignal(
    this.portfolioResource
  );
  readonly portfolioValue = this.portfolioStateService.createPortfolioValueSignal(
    this.portfolioResource
  );
  readonly hasPositions = this.portfolioStateService.createHasPositionsSignal(
    this.portfolioValue
  );

  openModal(): void {
    this.portfolioModalService.openModal(this.userId(), () => {
      this.portfolioResource.reload();
    });
  }
}
