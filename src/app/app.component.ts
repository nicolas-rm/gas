import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent } from '@/components/components';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterOutlet, ToastComponent, SidebarComponent, NavbarComponent, NavbarHorizontalComponent, MenuCanvasComponent, ShoppingCartComponent, CustomerSettingsComponent, ExampleComponent, SearchComponent, ContainerComponent],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        try { AppMin && AppMin(); } catch { }
        try { Theme && Theme(); } catch { }
    }
}
