import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AllExceptionsFilter } from '../common/all-exception.filter';
import { CreatePortfolioPositionDto } from './dto/create-portfolio-position.dto';
import { UpdatePortfolioPositionDto } from './dto/update-portfolio-position.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';

@Controller('users/:userId/portfolio')
@UseFilters(AllExceptionsFilter)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  /**
   * Добавить позицию в портфель пользователя
   * @param userId ID пользователя
   * @param body Данные позиции
   * @returns Созданная позиция
   */
  @Post()
  async addPosition(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreatePortfolioPositionDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.addPosition(userId, body);
  }

  /**
   * Получить текущий портфель пользователя
   * @param userId ID пользователя
   * @returns Список активных позиций
   */
  @Get()
  async getPortfolio(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PortfolioResponseDto[]> {
    return this.portfolioService.getPortfolio(userId);
  }

  /**
   * Обновить позицию в портфеле
   * @param userId ID пользователя
   * @param positionId ID позиции
   * @param body Данные для обновления
   * @returns Обновленная позиция
   */
  @Put(':id')
  async updatePosition(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) positionId: number,
    @Body() body: UpdatePortfolioPositionDto,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.updatePosition(userId, positionId, body);
  }

  /**
   * Закрыть позицию (soft delete)
   * @param userId ID пользователя
   * @param positionId ID позиции
   * @returns Закрытая позиция
   */
  @Delete(':id')
  async closePosition(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) positionId: number,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.closePosition(userId, positionId);
  }
}

