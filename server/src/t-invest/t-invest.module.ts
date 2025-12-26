import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TInvestService } from './t-invest.service';
import { TInvestConfig } from './t-invest.config';
import { TInvestController } from './t-invest.controller';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000, // 10 секунд таймаут
      maxRedirects: 5,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Игнорировать проверку SSL сертификата (для sandbox)
      }),
    }),
  ],
  controllers: [TInvestController],
  providers: [TInvestService, TInvestConfig],
  exports: [TInvestService],
})
export class TInvestModule {}

