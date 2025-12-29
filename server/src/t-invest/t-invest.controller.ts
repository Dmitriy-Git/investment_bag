import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { TInvestService } from './t-invest.service';
import { Currency } from './interfaces/currencies.interface';
import { Bond } from './interfaces/bonds.interface';
import {
  InstrumentStatus,
  InstrumentExchange,
} from './interfaces/common.interface';
import { AllExceptionsFilter } from '../common/all-exception.filter';
import { PaginatedResponse } from '../common/pagination.interface';

/**
 * Контроллер для работы с T-Invest API
 */
@Controller('t-invest')
@UseFilters(AllExceptionsFilter)
export class TInvestController {
  constructor(private readonly tInvestService: TInvestService) {}

  /**
   * Получить список валют
   * @param instrumentStatus Статус запрашиваемых инструментов
   * @param instrumentExchange Площадка торговли
   * @param page Номер страницы (начинается с 1)
   * @param limit Количество элементов на странице
   * @returns Список валют
   */
  @Get('currencies')
  async getCurrencies(
    @Query('instrumentStatus') instrumentStatus?: string,
    @Query('instrumentExchange') instrumentExchange?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Currency>> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
      page?: number;
      limit?: number;
    } = {};

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus as InstrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange as InstrumentExchange;
    }

    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        params.page = pageNumber;
      }
    }

    if (limit) {
      const limitNumber = parseInt(limit, 10);
      if (!isNaN(limitNumber) && limitNumber > 0) {
        params.limit = limitNumber;
      }
    }

    return this.tInvestService.getCurrencies(
      Object.keys(params).length > 0 ? params : undefined,
    );
  }

  /**
   * Получить список облигаций
   * @param instrumentStatus Статус запрашиваемых инструментов
   * @param instrumentExchange Площадка торговли
   * @param page Номер страницы (начинается с 1)
   * @param limit Количество элементов на странице
   * @returns Список облигаций
   */
  @Get('bonds')
  async getBonds(
    @Query('instrumentStatus') instrumentStatus?: string,
    @Query('instrumentExchange') instrumentExchange?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<Bond>> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
      page?: number;
      limit?: number;
    } = {};

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus as InstrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange as InstrumentExchange;
    }

    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        params.page = pageNumber;
      }
    }

    if (limit) {
      const limitNumber = parseInt(limit, 10);
      if (!isNaN(limitNumber) && limitNumber > 0) {
        params.limit = limitNumber;
      }
    }

    return this.tInvestService.getBonds(
      Object.keys(params).length > 0 ? params : undefined,
    );
  }
}

