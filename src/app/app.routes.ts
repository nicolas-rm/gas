import { Routes } from '@angular/router';
import { authenticationRoutes } from './authentication/authentication.routes';

export const routes: Routes = [
    // Rutas de autenticación 
    ...authenticationRoutes,
    // Ruta por defecto
    {
        path: '',
        redirectTo: 'authentication/sing-in',
        pathMatch: 'full',
    },
];
