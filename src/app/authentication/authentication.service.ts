import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { environment } from '@/env/environment.development';
import { ILoginRequest, ICredentials, IRefreshTokenResponse } from '@/authentication/ngrx/authentication.models';
import { selectRefreshToken } from '@/authentication/ngrx/authentication.selectors';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private http = inject(HttpClient);
    private store = inject(Store);

    // Sólo llama a la API. El effect/reducer maneja persistencia
    login(credentials: ICredentials): Observable<any> {
        const loginRequest: ILoginRequest = {
            email: credentials.email,
            passwordHash: credentials.password
        };

        // Add 5 second delay before executing the login request
        return new Observable(subscriber => {
            setTimeout(() => {
                this.http.post<any>(`${environment.apiUrl}/auth/login`, loginRequest)
                    .pipe(catchError(error => throwError(() => this.extractErrorMessage(error))))
                    .subscribe({
                        next: (response) => {
                            subscriber.next(response);
                            subscriber.complete();
                        },
                        error: (error) => {
                            subscriber.error(error);
                        }
                    });
            }, 5000);
        });
    }

    // Obtiene el refresh token del estado de NgRx en lugar del localStorage
    refreshToken(): Observable<IRefreshTokenResponse> {
        return this.store.select(selectRefreshToken).pipe(
            take(1),
            switchMap(refreshToken => {
                if (!refreshToken) {
                    return throwError(() => 'No refresh token available');
                }

                return this.http.post<IRefreshTokenResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
                    .pipe(catchError(error => throwError(() => this.extractErrorMessage(error))));
            })
        );
    }

    // Igual, solo API
    register(userData: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth/register`, userData).pipe(catchError(error => throwError(() => this.extractErrorMessage(error))));
    }

    // Ahora solo limpia el state local si lo necesitas, pero en realidad puedes dejarlo vacío y manejar todo con el reducer y meta-reducer
    logout(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            observer.next(true);
            observer.complete();
        });
    }

    verifyPassword(password: string): Observable<boolean> {
        return this.http.post<boolean>(`${environment.apiUrl}/auth/verify-password`, { password }).pipe(catchError(error => throwError(() => this.extractErrorMessage(error))));
    }

    private extractErrorMessage(error: any): string {
        if (Array.isArray(error.error?.message)) {
            return error.error.message.join(', ');
        }
        return error.error?.message || error.message || 'Error desconocido en autenticación';
    }
}
