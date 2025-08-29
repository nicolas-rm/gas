import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare const AppMin: (() => void) | undefined;
declare const Theme: (() => void) | undefined;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterOutlet]
})
export class AppComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        try { AppMin && AppMin(); } catch { }
        try { Theme && Theme(); } catch { }
    }
}
