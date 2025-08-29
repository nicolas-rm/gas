/**
 * Modelos de dominio para autenticación
 * Estos tipos representan entidades de negocio y no están acoplados a NgRx
 */

/**
 * Roles de usuario disponibles en el sistema
 */
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager'
}

/**
 * Información básica del usuario autenticado
 */
export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    lastName?: string;
    role?: UserRole;
}

/**
 * Tokens de autenticación con metadatos opcionales
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number; // cuándo expira el token (timestamp)
    issuedAt?: number; // cuándo fue emitido (timestamp)
}

/**
 * Datos completos de autenticación (usuario + tokens + metadata)
 */
export interface IAuthentication {
    // Tokens de autenticación
    tokens: AuthTokens | null;
    
    // Datos del usuario autenticado
    user: AuthUser | null;
    
    // Timestamp de la última actualización
    lastUpdated: number | null;
}

/**
 * Detalles del error en operaciones de autenticación
 */
export interface IAuthenticationError {
    // Código técnico del error
    code: string;
    
    // Mensaje legible para mostrar al usuario
    message: string;
    
    // Detalles técnicos adicionales (opcional)
    error?: string;
    
    // Cuándo ocurrió el error (formato ISO, opcional)
    timestamp?: string;
    
    // Endpoint donde ocurrió el error (opcional)
    path?: string;
    
    // ID de la petición para rastrear logs (opcional)
    requestId?: string;
    
    // Errores detallados por campo (útil para validaciones)
    details?: Record<string, string[]>;
}

// ============== API Request/Response Models ==============

/**
 * Credenciales de usuario para login
 */
export interface ICredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Datos de petición para login
 */
export interface ILoginRequest {
    email: string;
    passwordHash: string;
}

/**
 * Respuesta del servidor para login
 */
export interface ILoginResponse {
    success: boolean;
    data: {
        token: string;
        refreshToken: string;
        userId?: string;
        user?: Omit<AuthUser, 'id'> & { id?: string };
        email?: string;
    };
    message?: string;
}

/**
 * Datos de petición para registro
 */
export interface IRegisterRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

/**
 * Respuesta del servidor para refresh token
 */
export interface IRefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        expiresAt?: number;
    };
    message?: string;
}

/**
 * Error genérico de API
 */
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// ============== Interfaces Legacy (Deprecadas) ==============

/**
 * @deprecated Usar AuthenticationState en su lugar
 */
export interface IAuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    tokens: AuthTokens | null;
}

/**
 * @deprecated Usar AuthTokens en su lugar
 */
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

/**
 * @deprecated Usar AuthUser en su lugar
 */
export interface IUser {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    accessToken: string;
    permissions: string[];
}