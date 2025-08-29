// app.routes.ts
import { Routes } from '@angular/router';
import { authenticationRoutes } from '@/authentication/authentication.routes';
import { dashboardRoutes } from '@/dashboard/dashboard.routes';


// app.routes.ts
export const routes: Routes = [
    ...authenticationRoutes,
    ...dashboardRoutes,
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'sign-in',
        pathMatch: 'full',
    },
];
