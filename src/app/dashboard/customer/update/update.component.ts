import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomberTabInterface, tabs } from '@/app/dashboard/customer/form';
import { CommonModule } from '@angular/common';
import { GeneralDataComponent, ContractComponent, CommissionComponent, SaleComponent, BillingComponent, ContactsComponent, IneComponent, CreditRequestComponent } from '@/app/dashboard/customer/customer';
import { CustomerPageActions, selectCustomerLoading } from '@/app/dashboard/customer/ngrx';

@Component({
    selector: 'app-update',
    imports: [CommonModule, GeneralDataComponent, ContractComponent, CommissionComponent, SaleComponent, BillingComponent, ContactsComponent, IneComponent, CreditRequestComponent],
    templateUrl: './update.component.html',
    styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit, OnDestroy {
    readonly customerTabs: CustomberTabInterface[] = tabs;
    activeTab: string = 'general-data-tab';
    
    private readonly store = inject(Store);
    private readonly route = inject(ActivatedRoute);

    // Signal para estado de carga
    isLoading = this.store.selectSignal(selectCustomerLoading);

    ngOnInit(): void {
        // Establecer modo edit al montar el componente de actualización
        this.store.dispatch(CustomerPageActions.setViewMode({ viewMode: 'edit' }));
        
        // Obtener el ID del customer de la ruta si está disponible
        const customerId = this.route.snapshot.paramMap.get('id');
        if (customerId) {
            this.store.dispatch(CustomerPageActions.setCurrentCustomer({ customerId }));
            // Cargar los datos del cliente
            this.store.dispatch(CustomerPageActions.loadCustomer({ customerId }));
        }
    }

    ngOnDestroy(): void {
        // Limpiar el estado cuando se destruye el componente
        this.store.dispatch(CustomerPageActions.clearCurrentCustomer());
    }
}
