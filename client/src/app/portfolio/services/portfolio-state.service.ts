import { Injectable, computed, type Signal } from '@angular/core';
import type { PortfolioPosition } from '../../models/portfolio.model';

/**
 * Type representing a portfolio resource with required methods.
 */
type PortfolioResource = {
  isLoading(): boolean;
  error(): Error | undefined;
  hasValue(): boolean;
  value(): PortfolioPosition[] | undefined;
};

/**
 * Service for managing portfolio state and computed values.
 * Encapsulates logic for deriving state from portfolio resource.
 */
@Injectable({
  providedIn: 'root',
})
export class PortfolioStateService {
  /**
   * Creates a computed signal for loading state.
   */
  createIsLoadingSignal(
    portfolioResource: PortfolioResource
  ): Signal<boolean> {
    return computed(() => portfolioResource.isLoading());
  }

  /**
   * Creates a computed signal for error message.
   */
  createErrorMessageSignal(
    portfolioResource: PortfolioResource
  ): Signal<string | null> {
    return computed(() => {
      const error = portfolioResource.error();
      return error ? 'Failed to load portfolio. Please try again later.' : null;
    });
  }

  /**
   * Creates a computed signal for portfolio positions.
   */
  createPortfolioValueSignal(
    portfolioResource: PortfolioResource
  ): Signal<PortfolioPosition[]> {
    return computed(() =>
      portfolioResource.hasValue() ? (portfolioResource.value() ?? []) : []
    );
  }

  /**
   * Creates a computed signal indicating if portfolio has positions.
   */
  createHasPositionsSignal(
    portfolioValue: Signal<PortfolioPosition[]>
  ): Signal<boolean> {
    return computed(() => portfolioValue().length > 0);
  }
}
