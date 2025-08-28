import { Route } from '@angular/router';

export const authenticationRoutes: Route[] = [
    {
        path: 'authentication',
        loadComponent: () => import('./authentication.component').then((mod) => mod.AuthenticationComponent),
        children: [
            {
                path: 'sing-in',
                loadComponent: () => import('./authentication').then((mod) => mod.SingInComponent),
            },
            {
                path: 'sing-up',
                loadComponent: () => import('./authentication').then((mod) => mod.SingUpComponent),
            },
        ],
    },
];