import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { ngrxProviders } from './ngrx.config';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
        { provide: LOCALE_ID, useValue: 'es' },
        ...ngrxProviders
    ]
};
