import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { createAgent } from 'langchain';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { PortfolioService } from '../portfolio/portfolio.service';
import { FavoriteService } from '../favorite/favorite.service';
import { TInvestService } from '../t-invest/t-invest.service';

export interface StreamEvent {
  type: 'token' | 'done' | 'error' | 'tool_start' | 'tool_end';
  content?: string;
  toolName?: string;
}

@Injectable()
export class CreateAgentService {
  private readonly logger = new Logger(CreateAgentService.name);
  private agent: ReturnType<typeof createAgent>;

  private readonly systemPrompt = `Ты - инвестиционный помощник для приложения Investment Bag.

Возможности:
- Показать портфель пользователя (tool: getPortfolio)
- Показать избранные инструменты (tool: getFavorites)
- Искать инструменты по названию/тикеру (tool: searchInstruments)
- Получить информацию об акции (tool: getShareInfo)

Правила:
- Отвечай на русском языке
- Используй tools когда нужны реальные данные
- Будь кратким и полезным
- Не выдумывай данные - используй tools`;

  constructor(
    private readonly configService: ConfigService,
    private readonly portfolioService: PortfolioService,
    private readonly favoriteService: FavoriteService,
    private readonly tInvestService: TInvestService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not configured');
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: apiKey,
    });

    this.agent = createAgent({
      model,
      tools: this.createTools(),
      systemPrompt: this.systemPrompt,
    });
  }

  private createTools() {
    const getPortfolioTool = tool(
      async ({ userId }) => {
        this.logger.debug(`Executing getPortfolio for userId: ${userId}`);
        const portfolio = await this.portfolioService.getPortfolio(userId);

        if (portfolio.length === 0) {
          return 'Портфель пуст.';
        }

        return portfolio
          .map(
            (p, i) =>
              `${i + 1}. ${p.instrumentType} | ID: ${p.instrumentId} | Кол-во: ${p.quantity} | Цена покупки: ${p.purchasePrice}`,
          )
          .join('\n');
      },
      {
        name: 'getPortfolio',
        description: 'Получить инвестиционный портфель пользователя',
        schema: z.object({
          userId: z.number().describe('ID пользователя'),
        }),
      },
    );

    const getFavoritesTool = tool(
      async ({ userId }) => {
        this.logger.debug(`Executing getFavorites for userId: ${userId}`);
        const favorites = await this.favoriteService.getFavorites(userId);

        if (favorites.length === 0) {
          return 'Избранное пусто.';
        }

        return favorites
          .map((f, i) => `${i + 1}. ${f.instrumentType}: ${f.instrumentId}`)
          .join('\n');
      },
      {
        name: 'getFavorites',
        description: 'Получить список избранных инструментов пользователя',
        schema: z.object({
          userId: z.number().describe('ID пользователя'),
        }),
      },
    );

    const searchInstrumentsTool = tool(
      async ({ query }) => {
        this.logger.debug(`Executing searchInstruments for query: ${query}`);
        const result = await this.tInvestService.findInstrument({ query });

        if (!result.instruments?.length) {
          return `По запросу "${query}" ничего не найдено.`;
        }

        return result.instruments
          .slice(0, 5)
          .map(
            (inst, i) =>
              `${i + 1}. ${inst.name} (${inst.ticker}) - ${inst.instrumentKind ?? 'N/A'} | UID: ${inst.uid}`,
          )
          .join('\n');
      },
      {
        name: 'searchInstruments',
        description: 'Поиск финансовых инструментов по названию или тикеру',
        schema: z.object({
          query: z.string().describe('Поисковый запрос'),
        }),
      },
    );

    const getShareInfoTool = tool(
      async ({ uid }) => {
        this.logger.debug(`Executing getShareInfo for uid: ${uid}`);
        const share = await this.tInvestService.getShareBy({ id: uid });

        return `${share.name} (${share.ticker})
          Сектор: ${share.sector}
          Валюта: ${share.currency}
          Лот: ${share.lot}
          ISIN: ${share.isin}`;
      },
      {
        name: 'getShareInfo',
        description: 'Получить детальную информацию об акции по её UID',
        schema: z.object({
          uid: z.string().describe('UID акции'),
        }),
      },
    );

    return [
      getPortfolioTool,
      getFavoritesTool,
      searchInstrumentsTool,
      getShareInfoTool,
    ];
  }

  /**
   * Простой вызов без стриминга — возвращает финальный ответ
   */
  async chat(userId: number, message: string): Promise<string> {
    this.logger.debug(`Chat request from user ${userId}: ${message}`);

    try {
      const result = await this.agent.invoke({
        messages: [new HumanMessage(`userId: ${userId}\n\n${message}`)],
      });

      const lastMessage = result.messages[result.messages.length - 1];
      return lastMessage.content as string;
    } catch (error) {
      this.logger.error('Chat error', error);
      throw error;
    }
  }

  /**
   * Со стримингом — генератор событий для WebSocket
   */
  async *chatStream(
    userId: number,
    message: string,
  ): AsyncGenerator<StreamEvent> {
    this.logger.debug(`Chat stream request from user ${userId}: ${message}`);

    try {
      const stream = await this.agent.stream({
        messages: [new HumanMessage(`userId: ${userId}\n\n${message}`)],
      });

      let fullContent = '';

      for await (const chunk of stream) {
        // Обработка ответа модели (AIMessage)
        if (chunk.model_request?.messages) {
          for (const msg of chunk.model_request.messages) {
            if (msg.content) {
              const content = msg.content as string;
              fullContent += content;
              yield { type: 'token', content };
            }

            // Если есть tool_calls — агент хочет вызвать инструмент
            if (msg.tool_calls?.length) {
              for (const tc of msg.tool_calls) {
                yield {
                  type: 'tool_start',
                  toolName: tc.name,
                };
              }
            }
          }
        }
      }

      yield { type: 'done', content: fullContent };
    } catch (error) {
      this.logger.error('Chat stream error', error);
      yield {
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
