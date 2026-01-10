import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Portfolio, Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../common/prisma.service";
import { UserService } from "../user/user.service";
import { CreatePortfolioPositionDto } from "./dto/create-portfolio-position.dto";
import { UpdatePortfolioPositionDto } from "./dto/update-portfolio-position.dto";

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  /**
   * Добавить позицию в портфель пользователя
   * @param userId ID пользователя
   * @param data Данные позиции
   * @returns Созданная позиция
   */
  async addPosition(
    userId: number,
    data: CreatePortfolioPositionDto
  ): Promise<Portfolio> {
    // Проверяем существование пользователя
    const user = await this.userService.user({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return this.prisma.portfolio.create({
      data: {
        userId,
        instrumentId: data.instrumentId,
        instrumentType: data.instrumentType,
        quantity: data.quantity,
        purchasePrice: data.purchasePrice,
        purchaseDate: new Date(data.purchaseDate),
        notes: data.notes ?? null,
      },
    });
  }

  /**
   * Получить текущий портфель пользователя (без удаленных позиций)
   * @param userId ID пользователя
   * @returns Список активных позиций
   */
  async getPortfolio(userId: number): Promise<Portfolio[]> {
    return this.prisma.portfolio.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { purchaseDate: "desc" },
    });
  }

  /**
   * Обновить позицию в портфеле
   * @param userId ID пользователя
   * @param positionId ID позиции
   * @param data Данные для обновления
   * @returns Обновленная позиция
   */
  async updatePosition(
    userId: number,
    positionId: number,
    data: UpdatePortfolioPositionDto
  ): Promise<Portfolio> {
    // Проверяем существование позиции и принадлежность пользователю
    const position = await this.prisma.portfolio.findFirst({
      where: {
        id: positionId,
        userId,
        deletedAt: null,
      },
    });

    if (!position) {
      throw new NotFoundException(
        `Portfolio position with id ${positionId} not found for user ${userId}`
      );
    }

    const updateData: Prisma.PortfolioUpdateInput = {};

    if (data.quantity !== undefined) {
      updateData.quantity = data.quantity;
    }
    if (data.purchasePrice !== undefined) {
      updateData.purchasePrice = data.purchasePrice;
    }
    if (data.purchaseDate !== undefined) {
      updateData.purchaseDate = new Date(data.purchaseDate);
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    return this.prisma.portfolio.update({
      where: { id: positionId },
      data: updateData,
    });
  }

  /**
   * Закрыть позицию (soft delete)
   * @param userId ID пользователя
   * @param positionId ID позиции
   * @returns Закрытая позиция
   */
  async closePosition(userId: number, positionId: number): Promise<Portfolio> {
    const position = await this.prisma.portfolio.findFirst({
      where: {
        id: positionId,
        userId,
        deletedAt: null,
      },
    });

    if (!position) {
      throw new NotFoundException(
        `Portfolio position with id ${positionId} not found for user ${userId}`
      );
    }

    return this.prisma.portfolio.update({
      where: { id: positionId },
      data: { deletedAt: new Date() },
    });
  }
}
