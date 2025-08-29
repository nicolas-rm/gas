// Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// NgRx
import { Store } from '@ngrx/store';
import { selectAccessToken } from '@/authentication/ngrx/authentication.selectors';

// RxJS
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SignInGuard implements CanActivate {
    // Inyecciones de dependencias
    constructor(
        private store: Store,
        private router: Router
    ) { }

    // Verifica si el usuario puede activar la ruta de login
    canActivate(): Observable<boolean> {
        return this.store.select(selectAccessToken).pipe(
            take(1),
            // Permite acceso solo si NO hay token
            map(token => !token),
            // Si ya hay token, redirige al panel
            tap(allowed => {
                if (!allowed) {
                    void this.router.navigate(['/panel']);
                }
            })
        );
    }
}
