import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Данные для создания позиции в портфеле
 */
export class CreatePortfolioPositionDto {
  @IsString()
  @IsNotEmpty()
  instrumentId: string;

  @IsString()
  @IsNotEmpty()
  instrumentType: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  @IsPositive({ message: 'quantity must be a positive number' })
  @Type(() => Number) // Декоратор указывает class-transformer преобразовать значение в число перед валидацией:
  quantity: number;

  @IsNumber({}, { message: 'purchasePrice must be a number' })
  @Min(0, { message: 'purchasePrice must be a non-negative number' })
  @Type(() => Number)
  purchasePrice: number;

  @IsDateString({}, { message: 'purchaseDate must be a valid date string' })
  @IsNotEmpty()
  purchaseDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

