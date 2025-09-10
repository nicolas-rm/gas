// Angular
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
// (Store se mantiene si en el futuro se necesita, pero actualmente no requerido)

// RxJS
import { of } from 'rxjs';
import { catchError, delay, exhaustMap, map, tap } from 'rxjs/operators';

// Servicios y modelos propios
import { AuthPageActions, AuthApiActions } from '@/authentication/ngrx/authentication.actions';
import { IAuthentication } from '@/authentication/ngrx/authentication.state';
import { AuthenticationService } from '@/authentication/authentication.service';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';


/**
 * Effect: Login
 * Maneja el proceso de autenticación del usuario
 */
export const loginEffect = createEffect(
    (actions$ = inject(Actions), authenticationService = inject(AuthenticationService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(AuthPageActions.login),
            exhaustMap(({ email, password }) => {
                const toastRef = toast.loading('Iniciando sesión...');
                return authenticationService.login({ email, password }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('¡Inicio de sesión exitoso!');
                        // Mapea la respuesta al modelo del state
                        const auth: IAuthentication = {
                            tokens: {
                                accessToken: response.data.token,
                                refreshToken: response.data.refreshToken
                            },
                            user: {
                                id: response.data.userId || response.data.user?.id || '',
                                email: response.data.email || response.data.user?.email || ''
                            },
                            lastUpdated: Date.now()
                        };
                        return AuthApiActions.loginSuccess({ auth });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(AuthApiActions.loginFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Login Success
 * Redirige al dashboard tras login exitoso
 */
export const loginSuccessNav = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthApiActions.loginSuccess),
            tap(() => void router.navigate(['/panel']))
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Register
 * Maneja el proceso de registro de nuevos usuarios
 */
export const registerEffect = createEffect(
    (actions$ = inject(Actions), authenticationService = inject(AuthenticationService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(AuthPageActions.register),
            exhaustMap(({ name, lastName, email, password }) => {
                const toastRef = toast.loading('Registrando usuario...');
                return authenticationService.register({ name, lastName, email, password }).pipe(
                    map(auth => {
                        toastRef.close();
                        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
                        return AuthApiActions.registerSuccess({ auth });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(AuthApiActions.registerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Register Success
 * Redirige a la pantalla de login tras registro exitoso
 */
export const registerSuccessNav = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthApiActions.registerSuccess),
            tap(() => void router.navigate(['/inicio-sesion']))
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Lock Screen
 * Redirige a la pantalla de suspensión/bloqueo
 */
export const lockScreenNav = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthPageActions.lockScreen),
            tap(() => void router.navigate(['/suspencion']))
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Unlock Screen
 * Maneja el proceso de desbloqueo de pantalla con verificación de contraseña
 */
export const unlockScreenEffect = createEffect(
    (actions$ = inject(Actions), authenticationService = inject(AuthenticationService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(AuthPageActions.unlockScreen),
            exhaustMap(({ password }) => {
                const toastRef = toast.loading('Desbloqueando pantalla...');
                return authenticationService.verifyPassword(password).pipe(
                    map(isValid => {
                        toastRef.close();
                        if (isValid) {
                            toast.success('¡Pantalla desbloqueada!');
                            return AuthApiActions.unlockScreenSuccess();
                        } else {
                            toast.error('Contraseña incorrecta.');
                            return AuthApiActions.unlockScreenFailure({
                                error: {
                                    code: 'INVALID_PASSWORD',
                                    message: 'Contraseña incorrecta.'
                                }
                            });
                        }
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error as string);
                        return of(
                            AuthApiActions.unlockScreenFailure({
                                error: {
                                    code: 'UNLOCK_ERROR',
                                    message: error || 'No se pudo desbloquear la pantalla'
                                }
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Unlock Screen Success
 * Redirige al dashboard tras desbloquear pantalla exitosamente
 */
export const unlockSuccessNav = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthApiActions.unlockScreenSuccess),
            tap(() => void router.navigate(['/']))
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Logout
 * Maneja el proceso de cierre de sesión del usuario
 */
export const logoutEffect = createEffect(
    (actions$ = inject(Actions), authenticationService = inject(AuthenticationService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(AuthPageActions.logout),
            exhaustMap(() => {
                const toastRef = toast.loading('Cerrando sesión...');
                return authenticationService.logout().pipe(
                    delay(300), // Delay reducido para simular tiempo de logout
                    tap(() => {
                        // Cerrar el toast de loading
                        toastRef.close();
                    }),
                    map(() => {
                        // Mostrar toast de éxito con duración más corta
                        toast.success('Sesión cerrada correctamente.', {
                            duration: 2000 // 2 segundos en lugar del default
                        });
                        return AuthApiActions.logoutSuccess();
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(AuthApiActions.logoutFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Logout Success
 * Redirige a la pantalla de login tras cerrar sesión exitosamente
 */
export const logoutSuccessNav = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(AuthApiActions.logoutSuccess),
            tap(() => void router.navigate(['/inicio-sesion']))
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Refresh Token
 * Maneja la renovación de tokens de autenticación expirados
 */
export const refreshTokenEffect = createEffect(
    (actions$ = inject(Actions), authenticationService = inject(AuthenticationService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(AuthApiActions.refreshToken),
            exhaustMap(() => {
                const toastRef = toast.loading('Actualizando sesión...');
                return authenticationService.refreshToken().pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Sesión actualizada.');
                        // Mapear la respuesta al formato esperado por el reducer
                        const tokens = {
                            accessToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                            expiresAt: response.data.expiresAt
                        };
                        return AuthApiActions.refreshTokenSuccess({ tokens });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(AuthApiActions.refreshTokenFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Trigger Refresh Token
 * Despacha la acción de refresh sin mostrar toast (usado desde interceptor)
 */
export const triggerRefreshTokenEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(AuthPageActions.triggerRefreshToken),
            map(() => AuthApiActions.refreshToken())
        ),
    { functional: true }
);

/**
 * Effect: Trigger Logout
 * Despacha la acción de logout cuando el refresh falla (usado desde interceptor)
 */
export const triggerLogoutEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(AuthPageActions.triggerLogout),
            map(() => AuthPageActions.logout())
        ),
    { functional: true }
);
