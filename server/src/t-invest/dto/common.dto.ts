import { IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  InstrumentStatus,
  InstrumentExchange,
  InstrumentIdType,
} from '../interfaces';

/**
 * Базовый DTO для запросов с пагинацией
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Номер страницы (начинается с 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}

/**
 * Базовый DTO для запросов списка инструментов
 */
export class InstrumentListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Статус инструмента',
    enum: InstrumentStatus,
    example: InstrumentStatus.BASE,
  })
  @IsOptional()
  @IsEnum(InstrumentStatus)
  instrumentStatus?: InstrumentStatus;

  @ApiPropertyOptional({
    description: 'Тип биржи',
    enum: InstrumentExchange,
    example: InstrumentExchange.UNSPECIFIED,
  })
  @IsOptional()
  @IsEnum(InstrumentExchange)
  instrumentExchange?: InstrumentExchange;
}

/**
 * DTO для запроса инструмента по идентификатору
 */
export class GetInstrumentByIdDto {
  @ApiPropertyOptional({
    description: 'Тип идентификатора инструмента',
    enum: InstrumentIdType,
    example: InstrumentIdType.FIGI,
  })
  @IsOptional()
  @IsEnum(InstrumentIdType)
  idType?: InstrumentIdType;

  @ApiPropertyOptional({
    description: 'Код класса инструмента',
    example: 'TQBR',
  })
  @IsOptional()
  classCode?: string;
}
