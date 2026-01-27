import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentGateway } from './agent.gateway';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TInvestModule } from '../t-invest/t-invest.module';

@Module({
  imports: [PortfolioModule, FavoriteModule, TInvestModule],
  providers: [AgentService, AgentGateway],
  exports: [AgentService],
})
export class AgentModule {}
