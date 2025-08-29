// authentication.routes.ts
import { Route } from '@angular/router';
import { AuthenticationGuard } from '@/utils/guards/authentication.guard';

// dashboard.routes.ts
export const dashboardRoutes: Route[] = [
    {
        path: 'panel',
        loadComponent: () => import('./dashboard.component').then((mod) => mod.DashboardComponent),
        canActivate: [AuthenticationGuard], // Protege con autenticación
    },
];
