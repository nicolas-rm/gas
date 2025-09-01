import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;
declare const Toast: (() => void) | undefined;

declare global {
    interface Window {
        HSStaticMethods?: { autoInit?: () => void };
    }
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private router = inject(Router);
    private prelineLoaded = false;
    private navigationSubscription: any;

    /**
     * Carga el bundle de Preline de forma asíncrona
     */
    private async loadPreline(): Promise<void> {
        if (!this.prelineLoaded) {
            await import('public/assets/libs/preline/dist/preline.js' as any);
            this.prelineLoaded = true;
        }
    }

    /**
     * Inicializa los componentes de Preline
     */
    private prelineInit = (): void => {
        window.HSStaticMethods?.autoInit?.();
    };

    /**
     * Inicializa las funciones globales de tema (AppMin, Theme, Toast)
     */
    private initializeThemeFunctions(): void {
        try {
            AppMin && AppMin();
        } catch (error) {
            console.warn('Error initializing AppMin:', error);
        }

        try {
            Theme && Theme();
        } catch (error) {
            console.warn('Error initializing Theme:', error);
        }

        try {
            Toast && Toast();
        } catch (error) {
            console.warn('Error initializing Toast:', error);
        }
    }

    /**
     * Inicialización completa del tema y Preline
     */
    async initialize(): Promise<void> {
        // Inicializar funciones de tema
        this.initializeThemeFunctions();

        // Cargar e inicializar Preline
        await this.loadPreline();
        queueMicrotask(this.prelineInit);

        // Configurar reinicialización en navegación
        this.setupNavigationReinit();
    }

    /**
     * Configura la reinicialización de Preline tras cada navegación
     */
    private setupNavigationReinit(): void {
        // Limpiar suscripción anterior si existe
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }

        this.navigationSubscription = this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(async () => {
                await this.loadPreline(); // Asegurar que el bundle esté cargado
                setTimeout(this.prelineInit, 0); // Re-escanear DOM
            });
    }

    /**
     * Reinicializa Preline manualmente (útil para componentes dinámicos)
     */
    async reinitializePreline(): Promise<void> {
        await this.loadPreline();
        setTimeout(this.prelineInit, 0);
    }

    /**
     * Limpia las suscripciones del servicio
     */
    destroy(): void {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }
}