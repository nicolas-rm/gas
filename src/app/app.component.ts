import { Component, AfterViewInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;
declare const Toast: (() => void) | undefined;

// (Opcional) typings mínimos para evitar "any"
declare global {
    interface Window {
        HSStaticMethods?: { autoInit?: () => void };
    }
}

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterOutlet],
})
export class AppComponent implements AfterViewInit {
    private router = inject(Router);

    // Evita importar el bundle muchas veces
    private prelineLoaded = false;
    private loadPreline = async () => {
        if (!this.prelineLoaded) {
            await import('public/assets/libs/preline/dist/preline.js' as any); // 👈 bundle compilado
            this.prelineLoaded = true;
        }
    };

    private prelineInit = () => window.HSStaticMethods?.autoInit?.();

    async ngAfterViewInit() {
        // Tus inicializaciones
        try { AppMin && AppMin(); } catch { }
        try { Theme && Theme(); } catch { }
        try { Toast && Toast(); } catch { }

        // Carga inicial del bundle + init
        await this.loadPreline();
        queueMicrotask(this.prelineInit);

        // Re-init tras cada navegación
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(async () => {
                await this.loadPreline();        // por si el lazy load ocurre muy temprano
                setTimeout(this.prelineInit, 0); // re-scan DOM
            });
    }
}
