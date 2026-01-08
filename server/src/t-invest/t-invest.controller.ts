import {
  Get,
  Query,
  Param,
  UseFilters,
  Controller,
  ParseIntPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { TInvestService } from "./t-invest.service";
import { Currency } from "./interfaces/currencies.interface";
import { Bond } from "./interfaces/bonds.interface";
import { Share } from "./interfaces/shares.interface";
import {
  InstrumentIdType,
  InstrumentStatus,
  InstrumentExchange,
} from "./interfaces/common.interface";
import {
  InstrumentKind,
  FindInstrumentResponse,
} from "./interfaces/instruments.interface";
import { AllExceptionsFilter } from "../common/all-exception.filter";
import { PaginatedResponse } from "../common/pagination.interface";
import { ParseStringPipe } from "../common/parse-string.pipe";

/**
 * Контроллер для работы с T-Invest API
 */
@Controller("t-invest")
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
  @Get("currencies")
  async getCurrencies(
    @Query(
      "instrumentStatus",
      new ParseEnumPipe(InstrumentStatus, { optional: true })
    )
    instrumentStatus?: InstrumentStatus,
    @Query(
      "instrumentExchange",
      new ParseEnumPipe(InstrumentExchange, { optional: true })
    )
    instrumentExchange?: InstrumentExchange,
    @Query(
      "page",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1)
    )
    page?: number,
    @Query(
      "limit",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(10)
    )
    limit?: number
  ): Promise<PaginatedResponse<Currency>> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
      page?: number;
      limit?: number;
    } = { page, limit };

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange;
    }

    return this.tInvestService.getCurrencies(
      Object.keys(params).length > 0 ? params : undefined
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
  @Get("bonds")
  async getBonds(
    @Query(
      "instrumentStatus",
      new ParseEnumPipe(InstrumentStatus, { optional: true })
    )
    instrumentStatus?: InstrumentStatus,
    @Query(
      "instrumentExchange",
      new ParseEnumPipe(InstrumentExchange, { optional: true })
    )
    instrumentExchange?: InstrumentExchange,
    @Query(
      "page",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1)
    )
    page?: number,
    @Query(
      "limit",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(50)
    )
    limit?: number
  ): Promise<PaginatedResponse<Bond>> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
      page?: number;
      limit?: number;
    } = { page, limit };

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange;
    }

    return this.tInvestService.getBonds(
      Object.keys(params).length > 0 ? params : undefined
    );
  }

  /**
   * Получить список акций
   * @param instrumentStatus Статус запрашиваемых инструментов
   * @param instrumentExchange Площадка торговли
   * @param page Номер страницы (начинается с 1)
   * @param limit Количество элементов на странице
   * @returns Список акций
   */
  @Get("shares")
  async getShares(
    @Query(
      "instrumentStatus",
      new ParseEnumPipe(InstrumentStatus, { optional: true })
    )
    instrumentStatus?: InstrumentStatus,
    @Query(
      "instrumentExchange",
      new ParseEnumPipe(InstrumentExchange, { optional: true })
    )
    instrumentExchange?: InstrumentExchange,
    @Query(
      "page",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1)
    )
    page?: number,
    @Query(
      "limit",
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(50)
    )
    limit?: number
  ): Promise<PaginatedResponse<Share>> {
    const params: {
      instrumentStatus?: InstrumentStatus;
      instrumentExchange?: InstrumentExchange;
      page?: number;
      limit?: number;
    } = { page, limit };

    if (instrumentStatus) {
      params.instrumentStatus = instrumentStatus;
    }

    if (instrumentExchange) {
      params.instrumentExchange = instrumentExchange;
    }

    return this.tInvestService.getShares(
      Object.keys(params).length > 0 ? params : undefined
    );
  }

  /**
   * Получить информацию об одной облигации по идентификатору
   * @param id Идентификатор облигации (FIGI, Ticker, UID или Position UID)
   * @param idType Тип идентификатора (FIGI, TICKER, UID, POSITION_UID)
   * @param classCode Класс инструмента (обязателен при idType=TICKER)
   * @returns Информация об облигации
   */
  @Get("bonds/:id")
  async getBondBy(
    @Param("id") id: string,
    @Query(
      "idType",
      new DefaultValuePipe(InstrumentIdType.UID),
      new ParseEnumPipe(InstrumentIdType),
    )
    idType: InstrumentIdType,
    @Query("classCode") classCode?: string
  ): Promise<Bond> {
    const requestParams = {
      idType,
      id,
      ...(classCode && { classCode }),
    };

    return this.tInvestService.getBondBy(requestParams);
  }

  /**
   * Получить информацию об одной валюте по идентификатору
   * @param id Идентификатор валюты (FIGI, Ticker, UID или Position UID)
   * @param idType Тип идентификатора (FIGI, TICKER, UID, POSITION_UID)
   * @param classCode Класс инструмента (обязателен при idType=TICKER)
   * @returns Информация о валюте
   */
  @Get("currencies/:id")
  async getCurrencyBy(
    @Param("id") id: string,
    @Query(
      "idType",
      new DefaultValuePipe(InstrumentIdType.UID),
      new ParseEnumPipe(InstrumentIdType),
    )
    idType: InstrumentIdType,
    @Query("classCode") classCode?: string
  ): Promise<Currency> {
    const requestParams = {
      idType,
      id,
      ...(classCode && { classCode }),
    };

    return this.tInvestService.getCurrencyBy(requestParams);
  }

  /**
   * Получить информацию об одной акции по идентификатору
   * @param id Идентификатор акции (FIGI, Ticker, UID или Position UID)
   * @param idType Тип идентификатора (FIGI, TICKER, UID, POSITION_UID)
   * @param classCode Класс инструмента (обязателен при idType=TICKER)
   * @returns Информация об акции
   */
  @Get("shares/:id")
  async getShareBy(
    @Param("id") id: string,
    @Query(
      "idType",
      new DefaultValuePipe(InstrumentIdType.UID),
      new ParseEnumPipe(InstrumentIdType),
    )
    idType: InstrumentIdType,
    @Query("classCode") classCode?: string
  ): Promise<Share> {
    const requestParams = {
      idType,
      id,
      ...(classCode && { classCode }),
    };

    return this.tInvestService.getShareBy(requestParams);
  }

  /**
   * Поиск инструментов по запросу
   * @param query Строка поиска
   * @param instrumentKind Тип инструмента (опционально)
   * @returns Список найденных инструментов
   */
  @Get("instruments/search")
  async findInstrument(
    @Query("query", new ParseStringPipe())
    query: string,
    @Query(
      "instrumentKind",
      new ParseEnumPipe(InstrumentKind, { optional: true })
    )
    instrumentKind?: InstrumentKind
  ): Promise<FindInstrumentResponse> {
    const requestParams: {
      query: string;
      instrumentKind?: InstrumentKind;
    } = {
      query,
    };

    if (instrumentKind) {
      requestParams.instrumentKind = instrumentKind;
    }

    return this.tInvestService.findInstrument(requestParams);
  }
}
