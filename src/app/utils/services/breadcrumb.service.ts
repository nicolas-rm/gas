import { Injectable } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
    label: string;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
            const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
            this.breadcrumbs.next(breadcrumbs);
        });
    }

    /**
     * Obtiene los breadcrumbs actuales
     */
    getBreadcrumbs(): Observable<Breadcrumb[]> {
        return this.breadcrumbs.asObservable();
    }

    /**
     * Crea los breadcrumbs navegando por el árbol de rutas activadas
     */
    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        // Obtener los segmentos de URL de la ruta actual
        const routeURL = route.snapshot.url.map(segment => segment.path).join('/');

        // Construir la URL progresivamente
        if (routeURL !== '') {
            url += `/${routeURL}`;
        }

        // Obtener el label del breadcrumb de los datos de la ruta
        const label = route.snapshot.data['breadcrumb'];

        // Si hay un label válido, agregarlo al breadcrumb
        if (label && label.trim() !== '') {
            // Verificar si ya existe un breadcrumb con el mismo label y URL
            const existingIndex = breadcrumbs.findIndex(breadcrumb => breadcrumb.label === label && breadcrumb.url === url);

            // Solo agregar si no existe exactamente el mismo breadcrumb
            if (existingIndex === -1) {
                breadcrumbs.push({
                    label,
                    url: url || '/'
                });
            }
        }

        // Continuar recursivamente con las rutas hijas
        if (route.firstChild) {
            return this.createBreadcrumbs(route.firstChild, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
