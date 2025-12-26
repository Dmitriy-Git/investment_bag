import { Controller, Get, Query } from '@nestjs/common';
import { TInvestService } from './t-invest.service';
import { GetCurrenciesResponse } from './interfaces/currencies.interface';
import {
  InstrumentStatus,
  InstrumentExchange,
} from './interfaces/common.interface';

/**
 * Контроллер для работы с T-Invest API
 */
@Controller('t-invest')
export class TInvestController {
  constructor(private readonly tInvestService: TInvestService) {}

  /**
   * Получить список валют
   * @param instrumentStatus Статус запрашиваемых инструментов
   * @param instrumentExchange Площадка торговли
   * @returns Список валют
   */
  @Get('currencies')
  async getCurrencies(
    @Query('instrumentStatus') instrumentStatus?: string,
    @Query('instrumentExchange') instrumentExchange?: string,
  ): Promise<GetCurrenciesResponse> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
    } = {};

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus as InstrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange as InstrumentExchange;
    }

    return this.tInvestService.getCurrencies(
      Object.keys(params).length > 0 ? params : undefined,
    );
  }
}

