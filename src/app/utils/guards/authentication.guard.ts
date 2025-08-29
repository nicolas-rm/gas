// Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// NgRx
import { Store } from '@ngrx/store';
import { selectAccessToken } from '@/authentication/ngrx/authentication.selectors';

// RxJS
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
    // Inyecciones de dependencias
    constructor(
        private store: Store,
        private router: Router
    ) { }

    // Verifica si el usuario puede activar la ruta
    canActivate(): Observable<boolean> {
        return this.store.select(selectAccessToken).pipe(
            map(token => {
                // Si hay token, permite acceso
                if (token) {
                    return true;
                } else {
                    // Si no hay token, redirige al login
                    void this.router.navigate(['/sign-in']);
                    return false;
                }
            })
        );
    }
}
