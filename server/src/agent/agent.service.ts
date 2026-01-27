import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  ToolMessage,
  BaseMessage,
} from '@langchain/core/messages';
import { Subject } from 'rxjs';
import { PortfolioService } from '../portfolio/portfolio.service';
import { FavoriteService } from '../favorite/favorite.service';
import { TInvestService } from '../t-invest/t-invest.service';

export interface StreamEvent {
  type: 'token' | 'done' | 'error' | 'tool_start' | 'tool_end';
  content?: string;
  toolName?: string;
}

interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly model: ReturnType<ChatOpenAI['bindTools']>;

  private readonly tools = [
    {
      type: 'function' as const,
      function: {
        name: 'getPortfolio',
        description: 'Получить инвестиционный портфель пользователя',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'number', description: 'ID пользователя' },
          },
          required: ['userId'],
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'getFavorites',
        description: 'Получить список избранных инструментов пользователя',
        parameters: {
          type: 'object',
          properties: {
            userId: { type: 'number', description: 'ID пользователя' },
          },
          required: ['userId'],
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'searchInstruments',
        description: 'Поиск финансовых инструментов по названию или тикеру',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Поисковый запрос' },
          },
          required: ['query'],
        },
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'getShareInfo',
        description: 'Получить детальную информацию об акции по её UID',
        parameters: {
          type: 'object',
          properties: {
            uid: { type: 'string', description: 'UID акции' },
          },
          required: ['uid'],
        },
      },
    },
  ];

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

    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: apiKey,
    }).bindTools(this.tools);

  }
  /**
   * Выполняет tool по имени
   */
  private async executeTool(name: string, args: Record<string, unknown>): Promise<string> {
    this.logger.debug(`Executing tool: ${name}, args: ${JSON.stringify(args)}`);

    try {
      switch (name) {
        case 'getPortfolio':
          return await this.getPortfolio(args.userId as number);

        case 'getFavorites':
          return await this.getFavorites(args.userId as number);

        case 'searchInstruments':
          return await this.searchInstruments(args.query as string);

        case 'getShareInfo':
          return await this.getShareInfo(args.uid as string);

        default:
          return `Unknown tool: ${name}`;
      }
    } catch (error) {
      this.logger.error(`Tool ${name} error`, error);
      return `Ошибка выполнения ${name}`;
    }
  }

  private async getPortfolio(userId: number): Promise<string> {
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
  }

  private async getFavorites(userId: number): Promise<string> {
    const favorites = await this.favoriteService.getFavorites(userId);

    if (favorites.length === 0) {
      return 'Избранное пусто.';
    }

    return favorites
      .map((f, i) => `${i + 1}. ${f.instrumentType}: ${f.instrumentId}`)
      .join('\n');
  }

  private async searchInstruments(query: string): Promise<string> {
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
  }

  private async getShareInfo(uid: string): Promise<string> {
    const share = await this.tInvestService.getShareBy({ id: uid });

    return `${share.name} (${share.ticker})
      Сектор: ${share.sector}
      Валюта: ${share.currency}
      Лот: ${share.lot}
      ISIN: ${share.isin}`;
  }

  async chat(userId: number, message: string): Promise<Subject<StreamEvent>> {
    const stream$ = new Subject<StreamEvent>();
    this.processChat(userId, message, stream$);

    return stream$;
  }

  private async processChat(
    userId: number,
    message: string,
    stream$: Subject<StreamEvent>,
  ) {
    try {
      const messages: BaseMessage[] = [
        new SystemMessage(this.systemPrompt + `\n\nТекущий userId: ${userId}`),
        new HumanMessage(message),
      ];

      let iterations = 0;
      const maxIterations = 5;

      while (iterations < maxIterations) {
        iterations++;

        const response = await this.model.invoke(messages);

        const toolCalls = response.tool_calls as ToolCall[] | undefined;

        // No tool calls - stream final response
        if (!toolCalls || toolCalls.length === 0) {
          const finalStream = await this.model.stream(messages);
          let fullContent = '';

          for await (const chunk of finalStream) {
            const content = chunk.content as string;
            if (content) {
              fullContent += content;
              stream$.next({ type: 'token', content });
            }
          }

          stream$.next({ type: 'done', content: fullContent });
          break;
        }

        // Execute tool calls
        messages.push(response);

        for (const tc of toolCalls) {
          stream$.next({ type: 'tool_start', toolName: tc.name });

          const result = await this.executeTool(tc.name, tc.args);

          messages.push(
            new ToolMessage({
              content: result,
              tool_call_id: tc.id,
            }),
          );

          stream$.next({
            type: 'tool_end',
            toolName: tc.name,
            content: result,
          });
        }
      }

      stream$.complete();
    } catch (error) {
      this.logger.error('Chat processing error', error);

      stream$.next({
        type: 'error',
        content: error instanceof Error ? error.message : 'Unknown error',
      });
      stream$.complete();
    }
  }
}
