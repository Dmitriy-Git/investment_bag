import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import {
  PortfolioModalComponent,
  type PortfolioModalData,
} from '../components/portfolio-modal/portfolio-modal.component';

/**
 * Service for managing portfolio modal operations.
 * Encapsulates logic for opening and handling portfolio modal dialogs.
 */
@Injectable({
  providedIn: 'root',
})
export class PortfolioModalService {
  private readonly dialog = inject(MatDialog);

  /**
   * Opens the portfolio modal dialog.
   * @param userId - The user ID for the portfolio
   * @param onSuccess - Callback function called when modal is closed with success
   */
  openModal(userId: number, onSuccess?: () => void): void {
    const dialogRef = this.dialog.open<
      PortfolioModalComponent,
      PortfolioModalData,
      boolean
    >(PortfolioModalComponent, {
      autoFocus: 'dialog',
      restoreFocus: true,
      data: {
        userId,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => result === true))
      .subscribe(() => {
        onSuccess?.();
      });
  }
}
