import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  AppstoreOutline,
  StarOutline,
  BarChartOutline,
  HomeOutline,
} from '@ant-design/icons-angular/icons';
import type { IconDefinition } from '@ant-design/icons-angular';
import { errorInterceptor } from './core/interceptors/errors.interceptor';
import { baseUrlInterceptor } from './core/interceptors/baseURL.interceptor';

const icons: IconDefinition[] = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  AppstoreOutline,
  StarOutline,
  BarChartOutline,
  HomeOutline,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, errorInterceptor])),
    provideClientHydration(withEventReplay()),
    provideNzIcons(icons),
  ],
};
