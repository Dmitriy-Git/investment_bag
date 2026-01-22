import { ApiProperty } from '@nestjs/swagger';

/**
 * Позиция в портфеле пользователя
 */
export class PortfolioResponseDto {
  id: number;
  userId: number;
  instrumentId: string;
  instrumentType: string;

  @ApiProperty({ type: 'string', description: 'Количество', example: '10' })
  quantity: unknown;

  @ApiProperty({ type: 'string', description: 'Цена покупки', example: '250.50' })
  purchasePrice: unknown;

  purchaseDate: Date;
  notes: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}