import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'portfolio',
        loadComponent: () => 
          import('./portfolio/portfolio.component')
            .then(m => m.PortfolioComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => 
          import('./favorites/favorites.component')
            .then(m => m.FavoritesComponent)
      },
      {
        path: 'instruments',
        loadComponent: () => 
          import('./instruments/instruments.component')
            .then(m => m.InstrumentsComponent)
      }
    ]
  }
];
