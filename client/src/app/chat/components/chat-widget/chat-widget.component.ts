import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../services';
import { ChatPanelComponent } from '../chat-panel/chat-panel.component';

@Component({
  selector: 'app-chat-widget',
  imports: [MatButtonModule, MatIconModule, ChatPanelComponent],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWidgetComponent {
  protected readonly chatService = inject(ChatService);

  /** Открыта ли панель чата */
  protected readonly isOpen = signal(false);

  protected togglePanel(): void {
    this.isOpen.update((open) => !open);
  }
}
