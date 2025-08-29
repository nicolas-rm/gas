import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { ngrxProviders } from './ngrx.config';
import { TokenInterceptor } from './utils/interceptors/token.interceptor';

registerLocaleData(localeEs);

const maskConfig: Partial<NgxMaskConfig> = { validation: false };

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
        { provide: LOCALE_ID, useValue: 'es' },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        provideHotToastConfig({
            position: 'top-right',
            visibleToasts: 5,
            stacking: 'depth',
            dismissible: true
        }),
        provideEnvironmentNgxMask(maskConfig),
        ngrxProviders
    ]
};
