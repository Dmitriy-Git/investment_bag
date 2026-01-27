import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AgentService } from './agent.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/agent',
})
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AgentGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly agentService: AgentService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessageDto,
  ) {
    this.logger.debug(
      `Received message from user ${payload.userId}: ${payload.message}`,
    );

    try {
      // Используем AsyncGenerator вместо RxJS Subject
      for await (const event of this.agentService.chatStream(
        payload.userId,
        payload.message,
      )) {
        client.emit('stream', event);
      }

      this.logger.debug('Stream completed');
    } catch (error) {
      this.logger.error('Failed to process message', error);
      client.emit('error', { message: 'Failed to process message' });
    }
  }
}
