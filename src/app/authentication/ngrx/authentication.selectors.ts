// NgRx
import { createSelector, createFeature } from '@ngrx/store';

// Reducers propios
import { authenticationReducer, adapter } from '@/authentication/ngrx/authentication.reducer';


// Define el feature y obtén selectores base automáticamente
export const authenticationFeature = createFeature({
    name: 'authentication',
    reducer: authenticationReducer
});

// Selectores generados por createFeature (si tu reducer los expone, impórtalos desde allí)
// Ejemplos típicos:
const {
    selectAuthenticationState, // estado completo del slice
    selectStatus, // state.status
    selectLoading, // state.loading
    selectError, // state.error
    selectLockScreen, // state.lockScreen
    selectUser // state.user
} = authenticationFeature;

// Selectores del entity adapter
const { selectEntities, selectAll, selectIds, selectTotal } = adapter.getSelectors(selectAuthenticationState);

// Selectores derivados propios

// ¿Hay sesión activa?
export const selectIsAuthenticated = createSelector(selectStatus, status => status === 'authenticated');

// Access Token seguro
export const selectAccessToken = createSelector(selectUser, u => u?.tokens?.accessToken ?? null);

// Refresh Token
export const selectRefreshToken = createSelector(selectUser, u => u?.tokens?.refreshToken ?? null);

// Error legible (si necesitas transformar)
export const selectAuthError = createSelector(selectError, e => e);

// Loading directo (alias)
export const selectAuthLoading = selectLoading;

// Lock screen directo (alias)
export const selectLock = selectLockScreen;

// Entidades (si las usas)
export const selectAuthEntities = selectEntities;
export const selectAuthAll = selectAll;

// IDs de las entidades autenticadas
export const selectAuthIds = selectIds;

// Total de entidades autenticadas
export const selectAuthTotal = selectTotal;

// Si quieres conservar nombres anteriores con fixes:
export const selectCurrentUser = selectUser;

// Estado de autenticación
export const selectAuthStatus = selectStatus;

// “Success” como booleano:
export const selectAuthSuccess = createSelector(selectUser, u => !!u);
