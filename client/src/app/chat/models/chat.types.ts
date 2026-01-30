import { z } from 'zod';

// ============================================
// Server Events (входящие события от бекенда)
// ============================================

/**
 * Связанный финансовый инструмент
 */
export const RelatedInstrumentSchema = z.object({
  ticker: z.string(),
  name: z.string().optional(),
  uid: z.string().optional(),
});

export type RelatedInstrument = z.infer<typeof RelatedInstrumentSchema>;

/**
 * Структурированный ответ AI-помощника
 */
export const InvestmentResponseSchema = z.object({
  answer: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  actionType: z.enum(['info', 'recommendation', 'warning', 'analysis']),
  relatedInstruments: z.array(RelatedInstrumentSchema).optional(),
  suggestedActions: z.array(z.string()).optional(),
});

export type InvestmentResponse = z.infer<typeof InvestmentResponseSchema>;

/**
 * Событие стриминга от сервера
 */
export const StreamEventSchema = z.object({
  type: z.enum(['token', 'done', 'error', 'tool_start', 'tool_end']),
  content: z.string().optional(),
  toolName: z.string().optional(),
  structuredResponse: InvestmentResponseSchema.optional(),
});

export type StreamEvent = z.infer<typeof StreamEventSchema>;

/**
 * Событие подключения
 */
export const ConnectedEventSchema = z.object({
  id: z.string(),
});

export type ConnectedEvent = z.infer<typeof ConnectedEventSchema>;

/**
 * Событие ошибки
 */
export const ErrorEventSchema = z.object({
  message: z.string(),
});

export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

// ============================================
// Client Events (исходящие события на бекенд)
// ============================================

/**
 * Payload для отправки сообщения
 */
export const SendMessagePayloadSchema = z.object({
  userId: z.number(),
  message: z.string().min(1),
});

export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

// ============================================
// Client Models (локальные модели для UI)
// ============================================

/**
 * Вызов инструмента
 */
export const ToolCallSchema = z.object({
  name: z.string(),
  status: z.enum(['pending', 'done']),
});

export type ToolCall = z.infer<typeof ToolCallSchema>;

/**
 * Сообщение в чате (клиентская модель)
 */
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
  isStreaming: z.boolean().optional(),
  toolCalls: z.array(ToolCallSchema).optional(),
  structuredResponse: InvestmentResponseSchema.optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
