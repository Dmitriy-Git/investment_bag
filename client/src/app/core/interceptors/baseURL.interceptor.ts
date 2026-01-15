// client/src/app/core/interceptors/baseURL.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Проверяем, является ли URL относительным (не начинается с http:// или https://)
  if (!req.url.startsWith('http')) {
    // Убираем ведущий слеш из req.url, если он есть, чтобы не было двойного слеша с apiUrl
    const url = req.url.startsWith('/') ? req.url.substring(1) : req.url;

    const apiReq = req.clone({
      url: `${environment.apiUrl}/${url}`,
    });

    return next(apiReq);
  }

  return next(req);
};
