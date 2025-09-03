import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@/authentication/ngrx/authentication.actions';
import { AuthenticationState } from '@/app/authentication/ngrx/authentication.state';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    constructor(private store: Store<{ authentication: AuthenticationState }>) {}

    /**
     * Maneja el logout del usuario
     * Dispara la acción de logout que será manejada por los efectos de NgRx
     */
    onLogout(): void {
        this.store.dispatch(AuthPageActions.logout());
    }
}
