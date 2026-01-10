import {
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Данные для обновления позиции в портфеле
 */
export class UpdatePortfolioPositionDto {
  @IsNumber({}, { message: 'quantity must be a number' })
  @IsPositive({ message: 'quantity must be a positive number' })
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsNumber({}, { message: 'purchasePrice must be a number' })
  @Min(0, { message: 'purchasePrice must be a non-negative number' })
  @Type(() => Number)
  @IsOptional()
  purchasePrice?: number;

  @IsDateString({}, { message: 'purchaseDate must be a valid date string' })
  @IsOptional()
  purchaseDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

