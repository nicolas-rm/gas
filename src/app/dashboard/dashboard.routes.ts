// authentication.routes.ts
import { Route } from '@angular/router';
import { AuthenticationGuard } from '@/utils/guards/authentication.guard';
import { customerRoutes } from '@/dashboard/customer/customer.routes';

// dashboard.routes.ts
export const dashboardRoutes: Route[] = [
    {
        path: 'panel',
        loadComponent: () => import('./dashboard.component').then((mod) => mod.DashboardComponent),
        data: { breadcrumb: 'Panel' },
        canActivate: [AuthenticationGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('../components/example/example.component').then((mod) => mod.ExampleComponent  ),
                data: { breadcrumb: 'Inicio' },
            },
            ...customerRoutes
        ]
    },
];
