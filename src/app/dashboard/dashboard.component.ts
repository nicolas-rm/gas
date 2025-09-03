import { AfterViewInit, Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
    SidebarComponent, NavbarComponent,
    MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent,
    ExampleComponent, SearchComponent, ContainerComponent, BreadcrumbComponent
} from '@/components/components';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;
declare const Toast: (() => void) | undefined;

declare global {
    interface Window {
        HSStaticMethods?: { autoInit?: () => void };
    }
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'], // ← plural
    imports: [SidebarComponent, NavbarComponent, CustomerSettingsComponent, ContainerComponent, BreadcrumbComponent, RouterOutlet],
})
export class DashboardComponent implements AfterViewInit {
    private router = inject(Router);
    private prelineLoaded = false;

    private loadPreline = async () => {
        if (!this.prelineLoaded) {
            await import('public/assets/libs/preline/dist/preline.js' as any); // 👈 bundle compilado
            this.prelineLoaded = true;
        }
    };

    private prelineInit = () => window.HSStaticMethods?.autoInit?.();

    async ngAfterViewInit() {
        // tus inicializaciones
        try { AppMin && AppMin(); } catch { }
        try { Theme && Theme(); } catch { }
        try { Toast && Toast(); } catch { }

        // Preline: carga inicial + escaneo
        await this.loadPreline();
        queueMicrotask(this.prelineInit);

        // Preline: reinit tras cada navegación (por si este dashboard contiene vistas hijas)
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(async () => {
                await this.loadPreline();       // asegura bundle cargado
                setTimeout(this.prelineInit, 0); // re-scan DOM
            });
    }
}
