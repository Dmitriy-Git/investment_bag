import { Component, signal, effect, afterNextRender, inject, DOCUMENT } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatWidgetComponent } from '../chat';

@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, RouterOutlet, HeaderComponent, SidebarComponent, ChatWidgetComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly document = inject(DOCUMENT);
  
  protected readonly isCollapsed = signal(false);
  protected readonly sidebarTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Используем afterNextRender для выполнения кода только в браузере (не в SSR)
    afterNextRender(() => {
      effect(() => {
        const theme = this.sidebarTheme();
        this.document.documentElement.setAttribute('data-theme', theme);
      });
    });
  }
}

