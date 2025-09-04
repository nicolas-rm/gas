import { Component } from '@angular/core';
import { CustomberTabInterface, tabs } from '@/app/dashboard/customer/form';
import { CommonModule } from '@angular/common';
import { GeneralDataComponent, ContractComponent, CommissionComponent, SaleComponent, BillingComponent, ContactsComponent, IneComponent, CreditRequestComponent } from '@/app/dashboard/customer/customer';

@Component({
    selector: 'app-customer',
    imports: [CommonModule, GeneralDataComponent, ContractComponent, CommissionComponent, SaleComponent, BillingComponent, ContactsComponent, IneComponent, CreditRequestComponent],
    templateUrl: './customer.component.html',
    styleUrl: './customer.component.css'
})
export class CustomerComponent {
    readonly customerTabs: CustomberTabInterface[] = tabs;
    activeTab: string = 'general-data-tab'
}
