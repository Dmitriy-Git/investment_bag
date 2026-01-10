import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

/**
 * Данные для добавления инструмента в избранное
 */
export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty({ message: 'instrumentId is required' })
  instrumentId: string;

  @IsString()
  @IsNotEmpty({ message: 'instrumentType is required' })
  instrumentType: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

