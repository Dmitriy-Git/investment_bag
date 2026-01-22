import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstrumentListQueryDto, GetInstrumentByIdDto } from './common.dto';

/**
 * DTO для запроса списка акций
 */
export class GetSharesQueryDto extends InstrumentListQueryDto {}

/**
 * DTO для запроса акции по идентификатору
 */
export class GetShareByIdQueryDto extends GetInstrumentByIdDto {}

/**
 * DTO акции в ответе API
 */
export class ShareDto {
  @ApiProperty({ description: 'FIGI инструмента', example: 'BBG004730N88' })
  figi: string;

  @ApiProperty({ description: 'Тикер инструмента', example: 'SBER' })
  ticker: string;

  @ApiProperty({ description: 'Код класса инструмента', example: 'TQBR' })
  classCode: string;

  @ApiProperty({ description: 'ISIN инструмента', example: 'RU0009029540' })
  isin: string;

  @ApiProperty({ description: 'Лотность инструмента', example: 10 })
  lot: number;

  @ApiProperty({ description: 'Валюта расчётов', example: 'rub' })
  currency: string;

  @ApiProperty({ description: 'Название инструмента', example: 'Сбер Банк' })
  name: string;

  @ApiProperty({ description: 'Торговая площадка', example: 'MOEX' })
  exchange: string;

  @ApiProperty({
    description: 'Дата IPO',
    example: '2007-07-12T00:00:00Z',
  })
  ipoDate: string;

  @ApiProperty({ description: 'Размер выпуска', example: 21586948000 })
  issueSize: number;

  @ApiProperty({ description: 'Код страны риска', example: 'RU' })
  countryOfRisk: string;

  @ApiProperty({
    description: 'Название страны риска',
    example: 'Российская Федерация',
  })
  countryOfRiskName: string;

  @ApiProperty({ description: 'Сектор экономики', example: 'financial' })
  sector: string;

  @ApiProperty({
    description: 'Тип акции',
    example: 'SHARE_TYPE_COMMON',
  })
  shareType: string;

  @ApiProperty({
    description: 'Текущий торговый статус',
    example: 'SECURITY_TRADING_STATUS_NORMAL_TRADING',
  })
  tradingStatus: string;

  @ApiProperty({ description: 'Флаг внебиржевого инструмента', example: false })
  otcFlag: boolean;

  @ApiProperty({ description: 'Флаг доступности для покупки', example: true })
  buyAvailableFlag: boolean;

  @ApiProperty({ description: 'Флаг доступности для продажи', example: true })
  sellAvailableFlag: boolean;

  @ApiProperty({
    description: 'Флаг дивидендной акции',
    example: true,
  })
  divYieldFlag: boolean;

  @ApiProperty({
    description: 'Вид акции',
    example: 'SHARE_KIND_COMMON',
  })
  shareKind: string;

  @ApiProperty({
    description: 'Минимальный шаг цены',
    example: 0.01,
  })
  minPriceIncrement: number;

  @ApiProperty({
    description: 'Флаг доступности для торговли через API',
    example: true,
  })
  apiTradeAvailableFlag: boolean;

  @ApiProperty({
    description: 'Уникальный идентификатор инструмента',
    example: 'e6123145-9665-43e0-8413-cd61b8aa9b13',
  })
  uid: string;

  @ApiProperty({
    description: 'Реальная площадка торговли',
    example: 'REAL_EXCHANGE_MOEX',
  })
  realExchange: string;

  @ApiProperty({
    description: 'UID позиции',
    example: 'f6124256-0776-54f1-9524-de72c9bb0c24',
  })
  positionUid: string;

  @ApiProperty({
    description: 'Флаг доступности для ИИС',
    example: true,
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
    description: 'Первый минимальный шаг цены',
    example: 0.01,
  })
  firstMinPriceIncrement: number;

  @ApiProperty({
    description: 'Первое минимальное количество',
    example: 1,
  })
  firstMinQuantity: number;

  @ApiPropertyOptional({
    description: 'Уровень риска',
    example: 'RISK_LEVEL_MODERATE',
  })
  riskLevel: string;
}

/**
 * DTO ответа со списком акций
 */
export class GetSharesResponseDto {
  @ApiProperty({
    description: 'Список акций',
    type: [ShareDto],
  })
  instruments: ShareDto[];
}

/**
 * DTO ответа с информацией об одной акции
 */
export class GetShareByResponseDto {
  @ApiProperty({
    description: 'Информация об акции',
    type: ShareDto,
  })
  instrument: ShareDto;
}
