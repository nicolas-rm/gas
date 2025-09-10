// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { CustomerPageActions, CustomerApiActions } from './customer.actions';
import { CustomerData } from './customer.models';

// Import de acciones de cada tab para distribuir datos
import { GeneralDataApiActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';
import { ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { ContractDataApiActions } from '@/dashboard/customer/components/contract/ngrx/contract.actions';
import { CommissionDataApiActions } from '@/dashboard/customer/components/commission/ngrx/commission.actions';
import { SaleDataApiActions } from '@/dashboard/customer/components/sale/ngrx/sale.actions';
import { BillingDataApiActions } from '@/dashboard/customer/components/billing/ngrx/billing.actions';
import { IneDataApiActions } from '@/dashboard/customer/components/ine/ngrx/ine.actions';
import { CreditRequestDataApiActions } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.actions';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Customer
 */
export const loadCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerPageActions.loadCustomer),
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando datos del cliente...');
                return customerService.getCustomer(customerId).pipe(
                    map(customerResponse => {
                        toastRef.close();
                        toast.success('Datos del cliente cargados exitosamente');
                        // Transformar respuesta de API al formato del estado
                        const customerData: CustomerData = transformCustomerResponse(customerResponse, customerId);
                        return CustomerApiActions.loadCustomerSuccess({ customerData });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(CustomerApiActions.loadCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Distribute Customer Data
 */
export const distributeCustomerDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(CustomerApiActions.loadCustomerSuccess),
            map(({ customerData }) =>
                CustomerPageActions.distributeCustomerData({ customerData })
            )
        ),
    { functional: true }
);

/**
 * Effect: Distribute To Tabs
 */
export const distributeToTabsEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(CustomerPageActions.distributeCustomerData),
            tap(({ customerData }) => {
                // Distribuir datos a cada tab específico usando ApiActions
                if (customerData.generalData) {
                    store.dispatch(GeneralDataApiActions.loadDataSuccess({ 
                        data: customerData.generalData 
                    }));
                }
                
                if (customerData.contacts) {
                    store.dispatch(ContactsDataApiActions.loadDataSuccess({ 
                        data: customerData.contacts 
                    }));
                }
                
                if (customerData.contract) {
                    store.dispatch(ContractDataApiActions.loadDataSuccess({ 
                        data: customerData.contract 
                    }));
                }
                
                if (customerData.commission) {
                    store.dispatch(CommissionDataApiActions.loadDataSuccess({ 
                        data: customerData.commission 
                    }));
                }
                
                if (customerData.sale) {
                    store.dispatch(SaleDataApiActions.loadDataSuccess({ 
                        data: customerData.sale 
                    }));
                }
                
                if (customerData.billing) {
                    store.dispatch(BillingDataApiActions.loadDataSuccess({ 
                        data: customerData.billing 
                    }));
                }
                
                if (customerData.ine) {
                    store.dispatch(IneDataApiActions.loadDataSuccess({ 
                        data: customerData.ine 
                    }));
                }
                
                if (customerData.creditRequest) {
                    store.dispatch(CreditRequestDataApiActions.loadDataSuccess({ 
                        data: customerData.creditRequest 
                    }));
                }
            })
        ),
    { functional: true, dispatch: false }
);

/**
 * Función de transformación para convertir la respuesta de API al formato del estado
 * Transforma ICustomer del servicio a CustomerData del NgRx state
 */
function transformCustomerResponse(customerResponse: any, customerId: string): CustomerData {
    // Transformar la respuesta real del servicio a formato CustomerData
    // Por ahora usar datos mock hasta que la estructura de API esté definida
    // TODO: Mapear customerResponse.data a las secciones correspondientes
    
    const mockCustomerData: CustomerData = {
        id: customerId,
        generalData: {
            personType: 'Persona Física',
            groupType: 'Individual',
            rfc: 'XAXX010101000',
            businessName: 'Empresa Ejemplo S.A. de C.V.',
            tradeName: 'Empresa Ejemplo',
            street: 'Calle Principal',
            exteriorNumber: '123',
            interiorNumber: 'A',
            crossing: 'Entre Calle 1 y Calle 2',
            country: 'México',
            state: 'Ciudad de México',
            colony: 'Centro',
            municipality: 'Cuauhtémoc',
            postalCode: '06000',
            phone: '5555551234',
            city: 'Ciudad de México',
            fax: '5555555678'
        },
        contacts: {
            contacts: [
                {
                    name: 'Juan Pérez',
                    position: 'Gerente General',
                    phone: '5555551111',
                    email: 'juan.perez@empresa.com'
                },
                {
                    name: 'María García',
                    position: 'Directora Financiera',
                    phone: '5555552222',
                    email: 'maria.garcia@empresa.com'
                }
            ]
        },
        contract: null, // Será cargado por el tab específico si existe
        commission: null, // Será cargado por el tab específico si existe
        sale: null, // Será cargado por el tab específico si existe
        billing: null, // Será cargado por el tab específico si existe
        ine: null, // Será cargado por el tab específico si existe
        creditRequest: null // Será cargado por el tab específico si existe
    };

    return mockCustomerData;
}
