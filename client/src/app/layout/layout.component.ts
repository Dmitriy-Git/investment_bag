import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [MatSidenavModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  protected readonly isCollapsed = signal(false);
  protected readonly sidebarTheme = signal<'light' | 'dark'>('light');

  constructor() {
    effect(() => {
      const theme = this.sidebarTheme();
      document.documentElement.setAttribute('data-theme', theme);
    });
  }
}

