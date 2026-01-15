import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PortfolioService } from '../services/portfolio.service';
import { USER_ID } from '../constants/user.constants';
import type { PortfolioPosition } from '../models/portfolio.model';

@Component({
  selector: 'app-portfolio',
  imports: [],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  private readonly portfolioService = inject(PortfolioService);
  readonly userId = signal<number>(USER_ID);

  readonly portfolioResource = resource({
    params: () => ({ userId: this.userId() }),
    loader: ({ params }) => firstValueFrom(this.portfolioService.getPortfolio(params.userId)),
  });

  readonly isLoading = computed<boolean>(() => this.portfolioResource.isLoading());
  readonly errorMessage = computed<string | null>(() => {
    const error = this.portfolioResource.error();

    return error ? 'Failed to load portfolio. Please try again later.' : null;
  });

  readonly portfolioValue = computed<PortfolioPosition[]>(() => {
    return this.portfolioResource.hasValue() ? this.portfolioResource.value() : [];
  });

  readonly hasPositions = computed<boolean>(() => this.portfolioValue().length > 0);
}
