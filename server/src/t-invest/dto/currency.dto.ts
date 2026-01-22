import { ApiProperty } from '@nestjs/swagger';
import { InstrumentListQueryDto, GetInstrumentByIdDto } from './common.dto';

/**
 * DTO для запроса списка валют
 */
export class GetCurrenciesQueryDto extends InstrumentListQueryDto {}

/**
 * DTO для запроса валюты по идентификатору
 */
export class GetCurrencyByIdQueryDto extends GetInstrumentByIdDto {}

/**
 * DTO валюты в ответе API
 */
export class CurrencyDto {
  @ApiProperty({ description: 'FIGI инструмента', example: 'BBG0013HGFT4' })
  figi: string;

  @ApiProperty({ description: 'Тикер инструмента', example: 'USD000UTSTOM' })
  ticker: string;

  @ApiProperty({ description: 'Код класса инструмента', example: 'CETS' })
  classCode: string;

  @ApiProperty({ description: 'ISIN инструмента', example: '' })
  isin: string;

  @ApiProperty({ description: 'Лотность инструмента', example: 1000 })
  lot: number;

  @ApiProperty({ description: 'Валюта расчётов', example: 'rub' })
  currency: string;

  @ApiProperty({
    description: 'Название инструмента',
    example: 'Доллар США',
  })
  name: string;

  @ApiProperty({ description: 'Номинал', example: 1 })
  nominal: number;

  @ApiProperty({
    description: 'Текущий торговый статус',
    example: 'SECURITY_TRADING_STATUS_NORMAL_TRADING',
  })
  tradingStatus: string;

  @ApiProperty({
    description: 'Реальная площадка торговли',
    example: 'REAL_EXCHANGE_MOEX',
  })
  realExchange: string;

  @ApiProperty({
    description: 'UID позиции',
    example: '6e5a2c8e-7b3d-4f1a-9c2e-1d4f5a6b7c8d',
  })
  positionUid: string;

  @ApiProperty({
    description: 'Флаг доступности для ИИС',
    example: false,
  })
  forIisFlag: boolean;

  @ApiProperty({
    description: 'Флаг для квалифицированных инвесторов',
    example: false,
  })
  forQualInvestorFlag: boolean;

  @ApiProperty({ description: 'Флаг торговли в выходные', example: false })
  weekendFlag: boolean;

  @ApiProperty({ description: 'Флаг блокировки TCA', example: false })
  blockedTcaFlag: boolean;

  @ApiProperty({
    description: 'Флаг доступности для торговли через API',
    example: true,
  })
  apiTradeAvailableFlag: boolean;
}

/**
 * DTO ответа со списком валют
 */
export class GetCurrenciesResponseDto {
  @ApiProperty({
    description: 'Список валют',
    type: [CurrencyDto],
  })
  instruments: CurrencyDto[];
}

/**
 * DTO ответа с информацией об одной валюте
 */
export class GetCurrencyByResponseDto {
  @ApiProperty({
    description: 'Информация о валюте',
    type: CurrencyDto,
  })
  instrument: CurrencyDto;
}
