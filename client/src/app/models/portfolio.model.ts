// Типы данных (DTO) - соответствуют вашим серверным DTO
export interface CreatePortfolioPositionDto {
  instrumentId: string;
  instrumentType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
}

export interface UpdatePortfolioPositionDto {
  quantity?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
}

export interface PortfolioPosition {
  id: number;
  userId: number;
  instrumentId: string;
  instrumentType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
  deletedAt?: string;
}
