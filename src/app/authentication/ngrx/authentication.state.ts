// NgRx
import { EntityState } from '@ngrx/entity';

// Modelos propios
import { IAuthentication } from '@/authentication/ngrx/authentication.models';

/**
 * Tipos específicos de NgRx para autenticación
 */

/**
 * Tipos permitidos para el estado de autenticación en NgRx.
 */
export type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'refreshing'
  | 'locked'
  | 'error'
  | 'loggedOut';

/**
 * Claves para identificar diferentes operaciones de carga
 */
export type AuthLoadingKey = 'login' | 'logout' | 'refresh' | 'register';

/**
 * Estado global de autenticación para NgRx
 * Extiende EntityState para aprovechar las utilidades de @ngrx/entity
 */
export interface AuthenticationState extends EntityState<IAuthentication> {
  // Estado del flujo de autenticación
  status: AuthStatus;

  // Indica si una acción está en curso
  loading: boolean;

  // Mensaje de error en caso de fallo
  error: string | null;

  // Señala si la pantalla está bloqueada
  lockScreen: boolean;

  // Datos del usuario autenticado actual
  user: IAuthentication | null;
}

// Re-exportar modelos de dominio necesarios para el estado
export type {
  AuthUser,
  AuthTokens,
  IAuthentication,
  IAuthenticationError,
  ICredentials,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRefreshTokenResponse,
  ApiError,
} from '@/authentication/ngrx/authentication.models';

// Re-exportar enums (no son tipos puros)
export { UserRole } from '@/authentication/ngrx/authentication.models';
