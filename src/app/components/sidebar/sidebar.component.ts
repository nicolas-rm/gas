import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '@/utils/services/sidebar.service';
import { AuthenticationState } from '@/app/authentication/ngrx/authentication.state';
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@/app/authentication/ngrx/authentication.actions';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    readonly sidebarMenu

    // constructor(private store: Store<{ authentication: AuthenticationState }>) {}
    constructor(public sidebarService: SidebarService, private store: Store<{ authentication: AuthenticationState }>) {
        this.sidebarMenu = this.sidebarService.sidebarMenu;
    }

    /**
     * Maneja el logout del usuario
     * Dispara la acción de logout que será manejada por los efectos de NgRx
     */
    onLogout(): void {
        this.store.dispatch(AuthPageActions.logout());
    }
}
