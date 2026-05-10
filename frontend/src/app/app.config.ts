import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';


import { routes } from './app.routes';
import { authInterceptor } from './auth-interceptor';

export class CustomLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient( withInterceptors([authInterceptor])),
    provideTranslateService({
      fallbackLang: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new CustomLoader(http),
        deps: [HttpClient]
      }
    })
  ]
};