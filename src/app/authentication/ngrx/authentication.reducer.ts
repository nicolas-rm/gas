// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Estados propios
import { AuthenticationState, IAuthentication, AuthStatus } from '@/authentication/ngrx/authentication.state';
import { AuthPageActions, AuthApiActions } from '@/authentication/ngrx/authentication.actions';


// Adapter para manejar entidades (opcional si solo tienes 1 usuario)
export const adapter: EntityAdapter<IAuthentication> = createEntityAdapter<IAuthentication>({
    // Función para seleccionar el ID de la entidad
    selectId: auth => auth.user?.id ?? 'current'
});

// Estado inicial del slice de autenticación
export const initialState: AuthenticationState = adapter.getInitialState({
    status: 'idle',
    loading: false,
    error: null,
    lockScreen: false,
    user: null
});

// Reducer principal para autenticación
export const authenticationReducer = createReducer(
    initialState,

    // Iniciar sesión (loading=true, resetea error, status "authenticating")
    on(AuthPageActions.login, state => ({
        ...state,
        status: 'authenticating' as AuthStatus,
        loading: true,
        error: null
    })),

    // Iniciar sesión exitoso: guarda usuario/tokens, actualiza status, resetea error/loading
    on(AuthApiActions.loginSuccess, (state, { auth }) => {
        const updated = { ...auth, lastUpdated: Date.now() } as IAuthentication;
        const withEntity = adapter.setOne({ ...updated, user: updated.user }, state);

        return {
            ...withEntity,
            status: 'authenticated' as AuthStatus,
            loading: false,
            error: null,
            lockScreen: false,
            user: updated
        };
    }),

    // Iniciar sesión fallido: actualiza error, status "error", loading=false
    on(AuthApiActions.loginFailure, (state, { error }) => ({
        ...state,
        status: 'error' as AuthStatus,
        loading: false,
        error: error.message ?? 'Login failed'
    })),

    // Iniciar registro (loading=true, limpia error)
    on(AuthPageActions.register, state => ({
        ...state,
        loading: true,
        error: null
    })),

    // Registro exitoso: guarda usuario/tokens, status "authenticated"
    on(AuthApiActions.registerSuccess, (state, { auth }) => {
        const updated = { ...auth, lastUpdated: Date.now() } as IAuthentication;
        const withEntity = adapter.setOne(updated, state);

        return {
            ...withEntity,
            status: 'authenticated' as AuthStatus,
            loading: false,
            error: null,
            lockScreen: false,
            user: updated
        };
    }),

    // Registro fallido: actualiza error, status "error"
    on(AuthApiActions.registerFailure, (state, { error }) => ({
        ...state,
        status: 'error' as AuthStatus,
        loading: false,
        error: error.message ?? 'Register failed'
    })),

    // Cerrar sesión (loading=true)
    on(AuthPageActions.logout, state => ({
        ...state,
        loading: true,
        error: null
    })),

    // Logout exitoso: limpia todo, status "loggedOut"
    on(AuthApiActions.logoutSuccess, () => ({
        ...initialState,
        status: 'loggedOut' as AuthStatus
    })),

    // Logout fallido: mantiene usuario, muestra error
    on(AuthApiActions.logoutFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message ?? 'Logout failed'
    })),

    // Bloquear pantalla (lockScreen=true, status "locked")
    on(AuthPageActions.lockScreen, state => ({
        ...state,
        lockScreen: true,
        status: 'locked' as AuthStatus
    })),

    // Intento de desbloqueo (loading=true)
    on(AuthPageActions.unlockScreen, state => ({
        ...state,
        loading: true,
        error: null
    })),

    // Desbloqueo exitoso: lockScreen=false, vuelve a status anterior
    on(AuthApiActions.unlockScreenSuccess, state => ({
        ...state,
        loading: false,
        lockScreen: false,
        status: (state.user ? 'authenticated' : 'idle') as AuthStatus
    })),

    // Fallo en desbloqueo: lockScreen sigue, status "locked", muestra error
    on(AuthApiActions.unlockScreenFailure, (state, { error }) => ({
        ...state,
        loading: false,
        lockScreen: true,
        status: 'locked' as AuthStatus,
        error: error.message ?? 'Unlock failed'
    })),

    // Solicitud de refresh (loading=true, status "refreshing")
    on(AuthApiActions.refreshToken, state => ({
        ...state,
        status: 'refreshing' as AuthStatus,
        loading: true,
        error: null
    })),

    // Refresh exitoso: actualiza tokens del usuario, status "authenticated"
    on(AuthApiActions.refreshTokenSuccess, (state, { tokens }) => {
        if (!state.user) {
            return {
                ...state,
                status: 'authenticated' as AuthStatus,
                loading: false,
                error: null
            };
        }
        const updatedUser: IAuthentication = {
            ...state.user,
            tokens,
            lastUpdated: Date.now()
        };

        const withEntity = adapter.setOne(updatedUser, state);

        return {
            ...withEntity,
            status: 'authenticated' as AuthStatus,
            loading: false,
            error: null,
            user: updatedUser
        };
    }),

    // Refresh fallido: status "error", muestra error
    on(AuthApiActions.refreshTokenFailure, (state, { error }) => ({
        ...state,
        status: 'error' as AuthStatus,
        loading: false,
        error: error.message ?? 'Refresh token failed'
    })),

    // Limpia todo el estado de autenticación (reseteo manual)
    on(AuthPageActions.clearAuthState, () => ({
        ...initialState
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
