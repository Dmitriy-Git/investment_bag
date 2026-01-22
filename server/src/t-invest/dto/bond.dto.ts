import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstrumentListQueryDto, GetInstrumentByIdDto } from './common.dto';

/**
 * DTO для запроса списка облигаций
 */
export class GetBondsQueryDto extends InstrumentListQueryDto {}

/**
 * DTO для запроса облигации по идентификатору
 */
export class GetBondByIdQueryDto extends GetInstrumentByIdDto {}

/**
 * DTO облигации в ответе API
 */
export class BondDto {
  @ApiProperty({ description: 'FIGI инструмента', example: 'BBG00T22WKV5' })
  figi: string;

  @ApiProperty({ description: 'Тикер инструмента', example: 'SU26238RMFS4' })
  ticker: string;

  @ApiProperty({ description: 'Код класса инструмента', example: 'TQOB' })
  classCode: string;

  @ApiProperty({ description: 'ISIN инструмента', example: 'RU000A1038V6' })
  isin: string;

  @ApiProperty({ description: 'Лотность инструмента', example: 1 })
  lot: number;

  @ApiProperty({ description: 'Валюта расчётов', example: 'rub' })
  currency: string;

  @ApiProperty({ description: 'Название инструмента', example: 'ОФЗ 26238' })
  name: string;

  @ApiProperty({ description: 'Торговая площадка', example: 'MOEX' })
  exchange: string;

  @ApiProperty({
    description: 'Количество выплат по купонам в год',
    example: 2,
  })
  couponQuantityPerYear: number;

  @ApiProperty({
    description: 'Дата погашения облигации',
    example: '2041-05-21T00:00:00Z',
  })
  maturityDate: string;

  @ApiProperty({ description: 'Номинал', example: 1000 })
  nominal: number;

  @ApiProperty({
    description: 'Дата государственной регистрации',
    example: '2021-04-13T00:00:00Z',
  })
  stateRegDate: string;

  @ApiProperty({
    description: 'Дата размещения',
    example: '2021-04-21T00:00:00Z',
  })
  placementDate: string;

  @ApiProperty({ description: 'Цена размещения', example: 1000 })
  placementPrice: number;

  @ApiProperty({
    description: 'Накопленный купонный доход',
    example: 25.5,
  })
  aciValue: number;

  @ApiProperty({ description: 'Код страны риска', example: 'RU' })
  countryOfRisk: string;

  @ApiProperty({
    description: 'Название страны риска',
    example: 'Российская Федерация',
  })
  countryOfRiskName: string;

  @ApiProperty({ description: 'Сектор экономики', example: 'government' })
  sector: string;

  @ApiProperty({ description: 'Форма выпуска', example: 'documentary' })
  issueKind: string;

  @ApiProperty({ description: 'Размер выпуска', example: 350000000000 })
  issueSize: number;

  @ApiProperty({
    description: 'Плановый размер выпуска',
    example: 350000000000,
  })
  issueSizePlan: number;

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
    description: 'Флаг плавающего купона',
    example: false,
  })
  floatingCouponFlag: boolean;

  @ApiProperty({
    description: 'Флаг бессрочной облигации',
    example: false,
  })
  perpetualFlag: boolean;

  @ApiProperty({ description: 'Флаг амортизации', example: false })
  amortizationFlag: boolean;

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
    example: '6e5a2c8e-7b3d-4f1a-9c2e-1d4f5a6b7c8d',
  })
  uid: string;

  @ApiProperty({
    description: 'Реальная площадка торговли',
    example: 'REAL_EXCHANGE_MOEX',
  })
  realExchange: string;

  @ApiProperty({
    description: 'UID позиции',
    example: '7f6b3d9e-8c4e-5g2b-0d3f-2e5g6a7b8c9e',
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
    example: 'RISK_LEVEL_LOW',
  })
  riskLevel: string;
}

/**
 * DTO ответа со списком облигаций
 */
export class GetBondsResponseDto {
  @ApiProperty({
    description: 'Список облигаций',
    type: [BondDto],
  })
  instruments: BondDto[];
}

/**
 * DTO ответа с информацией об одной облигации
 */
export class GetBondByResponseDto {
  @ApiProperty({
    description: 'Информация об облигации',
    type: BondDto,
  })
  instrument: BondDto;
}
