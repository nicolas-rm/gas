// authentication.routes.ts
import { Route } from '@angular/router';

// customer.routes.ts
export const customerRoutes: Route[] = [
    {
        path: 'clientes',
        loadComponent: () => import('./customer.component').then((mod) => mod.CustomerComponent),
        data: { breadcrumb: 'Clientes' },
        children: [
            {
                path: '',
                data: { breadcrumb: 'Listado' },
                loadComponent: () => import('./create/create.component').then((mod) => mod.CreateComponent),
            },
            {
                path: 'registro',
                data: { breadcrumb: 'Registro' },
                loadComponent: () => import('./create/create.component').then((mod) => mod.CreateComponent),
            },
            {
                path: 'informacion/:id',
                data: { breadcrumb: 'Informacion' },
                loadComponent: () => import('./show/show.component').then((mod) => mod.ShowComponent),
            },
            {
                path: 'actualizar/:id',
                data: { breadcrumb: 'Actualizar' },
                loadComponent: () => import('./update/update.component').then((mod) => mod.UpdateComponent),
            },
        ],
    },
];
