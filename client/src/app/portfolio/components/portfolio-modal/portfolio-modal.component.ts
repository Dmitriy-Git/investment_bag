import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';
import { PortfolioService } from '../../services/portfolio.service';
import type { CreatePortfolioPositionDto } from '../../../models/portfolio.model';

export interface PortfolioModalData {
  userId: number;
}

@Component({
  selector: 'app-portfolio-modal',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './portfolio-modal.component.html',
  styleUrl: './portfolio-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly dialogRef = inject<MatDialogRef<PortfolioModalComponent>>(MatDialogRef);
  private readonly data = inject<PortfolioModalData>(MAT_DIALOG_DATA);

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    instrumentId: ['', [Validators.required]],
    instrumentType: ['', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0.01)]],
    purchasePrice: [0, [Validators.required, Validators.min(0.01)]],
    purchaseDate: ['', [Validators.required]],
    notes: [''],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const formValue = this.form.value;
      const purchaseDate = formValue.purchaseDate instanceof Date
        ? formValue.purchaseDate.toISOString().split('T')[0]
        : formValue.purchaseDate;

      const dto: CreatePortfolioPositionDto = {
        instrumentId: formValue.instrumentId,
        instrumentType: formValue.instrumentType,
        quantity: formValue.quantity,
        purchasePrice: formValue.purchasePrice,
        purchaseDate,
        notes: formValue.notes || undefined,
      };

      await firstValueFrom(this.portfolioService.addPosition(this.data.userId, dto));
      this.dialogRef.close(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при добавлении позиции';
      this.errorMessage.set(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}


