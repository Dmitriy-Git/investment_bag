import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstrumentKind } from '../interfaces';

/**
 * DTO для запроса поиска инструментов
 */
export class FindInstrumentQueryDto {
  @ApiProperty({
    description: 'Строка поиска (тикер, FIGI, ISIN или название)',
    example: 'SBER',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Тип инструмента для фильтрации',
    enum: InstrumentKind,
    example: InstrumentKind.SHARE,
  })
  @IsOptional()
  @IsEnum(InstrumentKind)
  instrumentKind?: InstrumentKind;
}

/**
 * DTO базового инструмента в ответе API
 */
export class InstrumentDto {
  @ApiProperty({ description: 'FIGI инструмента', example: 'BBG004730N88' })
  figi: string;

  @ApiProperty({ description: 'Тикер инструмента', example: 'SBER' })
  ticker: string;

  @ApiProperty({ description: 'Код класса инструмента', example: 'TQBR' })
  classCode: string;

  @ApiPropertyOptional({
    description: 'ISIN инструмента',
    example: 'RU0009029540',
  })
  isin?: string;

  @ApiProperty({ description: 'Лотность инструмента', example: 10 })
  lot: number;

  @ApiProperty({ description: 'Валюта расчётов', example: 'rub' })
  currency: string;

  @ApiProperty({ description: 'Название инструмента', example: 'Сбер Банк' })
  name: string;

  @ApiPropertyOptional({
    description: 'Торговая площадка',
    example: 'MOEX',
  })
  exchange?: string;

  @ApiPropertyOptional({
    description: 'Текущий торговый статус',
    example: 'SECURITY_TRADING_STATUS_NORMAL_TRADING',
  })
  tradingStatus?: string;

  @ApiPropertyOptional({
    description: 'Флаг внебиржевого инструмента',
    example: false,
  })
  otcFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг доступности для покупки',
    example: true,
  })
  buyAvailableFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг доступности для продажи',
    example: true,
  })
  sellAvailableFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг доступности для торговли через API',
    example: true,
  })
  apiTradeAvailableFlag?: boolean;

  @ApiProperty({
    description: 'Уникальный идентификатор инструмента',
    example: 'e6123145-9665-43e0-8413-cd61b8aa9b13',
  })
  uid: string;

  @ApiPropertyOptional({
    description: 'Реальная площадка торговли',
    example: 'REAL_EXCHANGE_MOEX',
  })
  realExchange?: string;

  @ApiProperty({
    description: 'UID позиции',
    example: 'f6124256-0776-54f1-9524-de72c9bb0c24',
  })
  positionUid: string;

  @ApiPropertyOptional({
    description: 'Флаг доступности для ИИС',
    example: true,
  })
  forIisFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг для квалифицированных инвесторов',
    example: false,
  })
  forQualInvestorFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг торговли в выходные',
    example: false,
  })
  weekendFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Флаг блокировки TCA',
    example: false,
  })
  blockedTcaFlag?: boolean;

  @ApiPropertyOptional({
    description: 'Тип инструмента',
    enum: InstrumentKind,
    example: InstrumentKind.SHARE,
  })
  instrumentKind?: InstrumentKind;
}

/**
 * DTO ответа с результатами поиска инструментов
 */
export class FindInstrumentResponseDto {
  @ApiProperty({
    description: 'Список найденных инструментов',
    type: [InstrumentDto],
  })
  instruments: InstrumentDto[];
}
