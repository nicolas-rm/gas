// Angular
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

// RxJS
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take, filter } from 'rxjs/operators';

// NgRx
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@/authentication/ngrx/authentication.actions';
import { selectAccessToken, selectAuthStatus } from '@/authentication/ngrx/authentication.selectors';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    // Flag para indicar si se está refrescando el token
    private isRefreshing = false;

    // Inyección del store de NgRx
    constructor(private store: Store) { }

    // Interceptor principal: agrega el token a las peticiones
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select(selectAccessToken).pipe(
            take(1),
            switchMap(token => {
                let authReq = req;

                // Si hay token y no es una petición de /auth, lo agrega al header
                if (token && !req.url.includes('/auth')) {
                    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                }

                // Manejo de errores en la respuesta
                return next.handle(authReq).pipe(
                    catchError(error => {
                        // Si expira el token (401), intenta refrescar
                        if (error.status === 401 && !req.url.includes('/auth')) {
                            return this.handle401Error(authReq, next);
                        }
                        return throwError(error);
                    })
                );
            })
        );
    }

    // Manejo de errores 401: refresca el token o dispara logout
    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;

            // Dispara la acción para refrescar el token
            this.store.dispatch(AuthPageActions.triggerRefreshToken());

            // Espera a que termine el refresh y valida el estado
            return this.store.select(selectAuthStatus).pipe(
                filter(status => status !== 'refreshing'), // Solo cuando deje de refrescar
                take(1),
                switchMap(status => {
                    this.isRefreshing = false;

                    // Si se autenticó correctamente, reintenta con el nuevo token
                    if (status === 'authenticated') {
                        return this.store.select(selectAccessToken).pipe(
                            take(1),
                            switchMap(newToken => {
                                const cloned = request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                                return next.handle(cloned);
                            })
                        );
                    } else {
                        // Si falla, dispara logout
                        this.store.dispatch(AuthPageActions.triggerLogout());
                        return throwError(() => 'No autorizado');
                    }
                })
            );
        } else {
            // Si ya se está refrescando, usa el token actual
            return this.store.select(selectAccessToken).pipe(
                take(1),
                switchMap(token => {
                    const cloned = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                    return next.handle(cloned);
                })
            );
        }
    }
}
