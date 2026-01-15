import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { ROUTES } from '../../constants/routes.constants';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NzMenuModule, NzIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);

  collapsed = input.required<boolean>();
  theme = input.required<'light' | 'dark'>();

  // toSignal — конвертация Observable → Signal
  currentUrl = toSignal(
    // router.events — Observable, который эмитит события маршрутизации
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  menuItems: MenuItem[] = [
    {
      title: 'Главная',
      icon: 'home',
      route: ROUTES.HOME,
      exact: true,
    },
    {
      title: 'Портфель',
      icon: 'bar-chart',
      route: ROUTES.PORTFOLIO,
    },
    {
      title: 'Избранное',
      icon: 'star',
      route: ROUTES.FAVORITES,
    },
  ];

  isRouteActive = (route: string, exact?: boolean): boolean => {
    const url = this.currentUrl() ?? '';
    if (exact || route === ROUTES.HOME) {
      return url === route || (route === ROUTES.HOME && url === '');
    }
    return url.startsWith(route);
  };
}
