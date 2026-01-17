import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PortfolioPosition,
  CreatePortfolioPositionDto,
  UpdatePortfolioPositionDto,
} from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);

  // Используем относительные пути - baseUrl добавится автоматически
  getPortfolio(userId: number): Observable<PortfolioPosition[]> {
    return this.http.get<PortfolioPosition[]>(`users/${userId}/portfolio`);
  }

  addPosition(userId: number, position: CreatePortfolioPositionDto): Observable<PortfolioPosition> {
    return this.http.post<PortfolioPosition>(`users/${userId}/portfolio`, position);
  }

  updatePosition(
    userId: number,
    positionId: number,
    position: UpdatePortfolioPositionDto
  ): Observable<PortfolioPosition> {
    return this.http.put<PortfolioPosition>(`users/${userId}/portfolio/${positionId}`, position);
  }

  closePosition(userId: number, positionId: number): Observable<PortfolioPosition> {
    return this.http.delete<PortfolioPosition>(`users/${userId}/portfolio/${positionId}`);
  }
}
