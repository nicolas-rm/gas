// NgRx
import { createActionGroup, emptyProps, props } from '@ngrx/store';

// Estados propios
import { IAuthentication, IAuthenticationError } from '@/authentication/ngrx/authentication.state';


/**
 * Acciones desde la UI (Page)
 */
export const AuthPageActions = createActionGroup({
    source: 'Auth Page',
    events: {
        // Iniciar sesión
        Login: props<{ email: string; password: string }>(),

        // Cerrar sesión
        Logout: emptyProps(),

        // Registrar usuario
        Register: props<{ name: string; lastName: string; email: string; password: string }>(),

        // Bloquear pantalla
        'Lock Screen': emptyProps(),

        // Desbloquear pantalla (pide contraseña local)
        'Unlock Screen': props<{ password: string }>(),

        // Limpiar estado manualmente
        'Clear Auth State': emptyProps(),

        // Disparador de Refresh Token
        'Trigger Refresh Token': emptyProps(),

        // Disparador de Logout
        'Trigger Logout': emptyProps()
    }
});

/**
 * Acciones desde los efectos (Effects)
 */
export const AuthApiActions = createActionGroup({
    source: 'Auth API',
    events: {
        // Login
        'Login Success': props<{ auth: IAuthentication }>(),
        'Login Failure': props<{ error: IAuthenticationError }>(),

        // Logout
        'Logout Success': emptyProps(),
        'Logout Failure': props<{ error: IAuthenticationError }>(),

        // Registro
        'Register Success': props<{ auth: IAuthentication }>(),
        'Register Failure': props<{ error: IAuthenticationError }>(),

        // Desbloqueo
        'Unlock Screen Success': emptyProps(),
        'Unlock Screen Failure': props<{ error: IAuthenticationError }>(),

        // Refresh de token
        'Refresh Token': emptyProps(),
        'Refresh Token Success': props<{ tokens: IAuthentication['tokens'] }>(),
        'Refresh Token Failure': props<{ error: IAuthenticationError }>()
    }
});
