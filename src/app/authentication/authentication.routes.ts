// authentication.routes.ts
import { Route } from '@angular/router';
import { SignInGuard } from '@/utils/guards/sign-in.guard';

// authentication.routes.ts
export const authenticationRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./authentication.component').then((mod) => mod.AuthenticationComponent),
        canActivate: [SignInGuard],
        children: [
            {
                path: 'sign-in',
                loadComponent: () => import('./authentication').then((mod) => mod.SignInComponent),
            },
            {
                path: 'sign-up',
                loadComponent: () => import('./authentication').then((mod) => mod.SignUpComponent),
            },
        ],
    },
];
