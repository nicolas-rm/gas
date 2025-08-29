import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent } from '@/components/components';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;

@Component({
    selector: 'app-dashboard',
    imports: [ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        setTimeout(() => {
            try { AppMin && AppMin(); } catch { }
            try { Theme && Theme(); } catch { }
        }, 200);
    }
}
