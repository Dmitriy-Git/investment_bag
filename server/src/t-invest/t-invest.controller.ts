import {
  Get,
  Query,
  Param,
  UseFilters,
  Controller,
} from "@nestjs/common";
import { TInvestService } from "./t-invest.service";
import { AllExceptionsFilter } from "../common/all-exception.filter";
import { PaginatedResponse } from "../common/pagination.interface";
import {
  // Currency DTOs
  GetCurrenciesQueryDto,
  GetCurrencyByIdQueryDto,
  CurrencyDto,
  // Bond DTOs
  GetBondsQueryDto,
  GetBondByIdQueryDto,
  BondDto,
  // Share DTOs
  GetSharesQueryDto,
  GetShareByIdQueryDto,
  ShareDto,
  // Instrument DTOs
  FindInstrumentQueryDto,
  FindInstrumentResponseDto,
} from "./dto";

/**
 * Контроллер для работы с T-Invest API
 */
@Controller("t-invest")
@UseFilters(AllExceptionsFilter)
export class TInvestController {
  constructor(private readonly tInvestService: TInvestService) { }

  /**
   * Получить список валют
   */
  @Get("currencies")
  async getCurrencies(
    @Query() query: GetCurrenciesQueryDto
  ): Promise<PaginatedResponse<CurrencyDto>> {
    return this.tInvestService.getCurrencies(query);
  }

  /**
   * Получить информацию об одной валюте по идентификатору
   */
  @Get("currencies/:id")
  async getCurrencyBy(
    @Param("id") id: string,
    @Query() query: GetCurrencyByIdQueryDto
  ): Promise<CurrencyDto> {
    return this.tInvestService.getCurrencyBy({
      id,
      idType: query.idType,
      classCode: query.classCode,
    });
  }

  /**
   * Получить список облигаций
   */
  @Get("bonds")
  async getBonds(
    @Query() query: GetBondsQueryDto
  ): Promise<PaginatedResponse<BondDto>> {
    return this.tInvestService.getBonds(query);
  }

  /**
   * Получить информацию об одной облигации по идентификатору
   */
  @Get("bonds/:id")
  async getBondBy(
    @Param("id") id: string,
    @Query() query: GetBondByIdQueryDto
  ): Promise<BondDto> {
    return this.tInvestService.getBondBy({
      id,
      idType: query.idType,
      classCode: query.classCode,
    });
  }

  /**
   * Получить список акций
   */
  @Get("shares")
  async getShares(
    @Query() query: GetSharesQueryDto
  ): Promise<PaginatedResponse<ShareDto>> {
    return this.tInvestService.getShares(query);
  }

  /**
   * Получить информацию об одной акции по идентификатору
   */
  @Get("shares/:id")
  async getShareBy(
    @Param("id") id: string,
    @Query() query: GetShareByIdQueryDto
  ): Promise<ShareDto> {
    return this.tInvestService.getShareBy({
      id,
      idType: query.idType,
      classCode: query.classCode,
    });
  }

  /**
   * Поиск инструментов по запросу
   */
  @Get("instruments/search")
  async findInstrument(
    @Query() query: FindInstrumentQueryDto
  ): Promise<FindInstrumentResponseDto> {
    return this.tInvestService.findInstrument(query);
  }
}
