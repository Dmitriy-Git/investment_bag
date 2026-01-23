import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ROUTES } from '../../constants/routes.constants';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapsed = input.required<boolean>();
  theme = input.required<'light' | 'dark'>();

  themeChange = output<'light' | 'dark'>();

  menuItems: MenuItem[] = [
    {
      title: 'Главная',
      icon: 'home',
      route: ROUTES.HOME,
      exact: true,
    },
    {
      title: 'Портфель',
      icon: 'bar_chart',
      route: ROUTES.PORTFOLIO,
    },
    {
      title: 'Избранное',
      icon: 'star',
      route: ROUTES.FAVORITES,
    },
    {
      title: 'Инструменты',
      icon: 'category',
      route: ROUTES.INSTRUMENTS,
    },
  ];

  onThemeToggle(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.themeChange.emit(newTheme);
  }
}
