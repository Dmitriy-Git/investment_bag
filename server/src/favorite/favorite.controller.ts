import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Favorite } from '../generated/prisma/client.js';
import { AllExceptionsFilter } from '../common/all-exception.filter';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('users/:userId/favorites')
@UseFilters(AllExceptionsFilter)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * Добавить инструмент в избранное пользователя
   * @param userId ID пользователя
   * @param body Данные избранного (instrumentId, instrumentType, notes?)
   * @returns Созданная запись избранного
   */
  @Post()
  async addFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateFavoriteDto,
  ): Promise<Favorite> {
    return this.favoriteService.addFavorite(userId, body);
  }

  /**
   * Получить все избранное пользователя
   * @param userId ID пользователя
   * @returns Список избранных инструментов
   */
  @Get()
  async getFavorites(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Favorite[]> {
    return this.favoriteService.getFavorites(userId);
  }

  /**
   * Удалить инструмент из избранного
   * @param userId ID пользователя
   * @param instrumentId ID инструмента
   * @returns Удаленная запись избранного
   */
  @Delete(':instrumentId')
  async removeFavorite(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('instrumentId') instrumentId: string,
  ): Promise<Favorite> {
    return this.favoriteService.removeFavorite(userId, instrumentId);
  }
}

