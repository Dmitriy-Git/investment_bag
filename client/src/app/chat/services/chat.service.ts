import { Injectable, signal, afterNextRender } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { USER_ID } from '../../constants/user.constants';
import { ChatMessage, StreamEvent, StreamEventSchema } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | null = null;

  /** Список сообщений чата */
  readonly messages = signal<ChatMessage[]>([]);

  /** Статус подключения */
  readonly isConnected = signal(false);

  /** Идёт ли обработка запроса */
  readonly isLoading = signal(false);

  constructor() {
    afterNextRender(() => {
      this.connect();
    });
  }

  /**
   * Подключиться к WebSocket серверу
   */
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(`${environment.apiUrl}/agent`, {
      transports: ['websocket'],
    });

    this.socket.on('connected', () => this.isConnected.set(true));
    this.socket.on('disconnect', () => this.isConnected.set(false));
    this.socket.on('stream', (data: unknown) => this.handleStream(data));
  }

  /**
   * Отключиться от сервера
   */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.isConnected.set(false);
  }

  /**
   * Отправить сообщение
   */
  sendMessage(content: string): void {
    if (!this.socket?.connected || !content.trim()) return;

    // Сообщение пользователя
    this.addMessage('user', content.trim());

    // Пустое сообщение ассистента для стриминга
    this.addMessage('assistant', '', true);

    this.isLoading.set(true);
    this.socket.emit('message', { userId: USER_ID, message: content.trim() });
  }

  private addMessage(role: 'user' | 'assistant', content: string, isStreaming = false): void {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      isStreaming,
    };
    this.messages.update((msgs) => [...msgs, msg]);
  }

  private handleStream(data: unknown): void {
    const result = StreamEventSchema.safeParse(data);
    if (!result.success) return;

    const event = result.data;

    if (event.type === 'token') {
      this.appendContent(event.content ?? '');
    } else if (event.type === 'done') {
      this.finalize(event.content);
      this.isLoading.set(false);
    } else if (event.type === 'error') {
      this.appendContent(`\nОшибка: ${event.content}`);
      this.finalize();
      this.isLoading.set(false);
    }
  }

  private appendContent(text: string): void {
    this.messages.update((msgs) => {
      const last = msgs[msgs.length - 1];
      if (last?.role !== 'assistant') return msgs;
      return [...msgs.slice(0, -1), { ...last, content: last.content + text }];
    });
  }

  private finalize(content?: string): void {
    this.messages.update((msgs) => {
      const last = msgs[msgs.length - 1];
      if (last?.role !== 'assistant') return msgs;
      return [
        ...msgs.slice(0, -1),
        {
          ...last,
          content: content ?? last.content,
          isStreaming: false,
        },
      ];
    });
  }
}
