import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-customer',
    imports: [RouterOutlet],
    template: `
    <router-outlet></router-outlet>
  `,
})
export class CustomerComponent { }
