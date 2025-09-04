import { Component } from '@angular/core';
import { CustomerComponent } from "@/dashboard/customer/components/customer.component";

@Component({
    selector: 'app-create',
    imports: [CustomerComponent],
    templateUrl: './create.component.html',
    styleUrl: './create.component.css'
})
export class CreateComponent { }
