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
                console.log('🔍 Iniciando carga de customer con ID:', customerId);
                const toastRef = toast.loading('Cargando datos del cliente...');
                return customerService.getCustomer(customerId).pipe(
                    map(customerResponse => {
                        console.log('✅ Respuesta del servicio recibida:', customerResponse);
                        toastRef.close();
                        toast.success('Datos del cliente cargados exitosamente');
                        // Transformar respuesta de API al formato del estado
                        const customerData: CustomerData = transformCustomerResponse(customerResponse, customerId);
                        console.log('🔄 Datos transformados para el estado:', customerData);
                        return CustomerApiActions.loadCustomerSuccess({ customerData });
                    }),
                    catchError(error => {
                        console.error('❌ Error al cargar customer:', error);
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
            map(({ customerData }) => {
                console.log('🎯 Disparando distribución automática de datos:', customerData);
                return CustomerPageActions.distributeCustomerData({ customerData });
            })
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
                console.log('🔄 Distribuyendo datos del customer a los tabs:', customerData);
                
                // Distribuir datos a cada tab específico usando ApiActions
                // Solo despachar si existen datos para esa sección
                if (customerData.generalData) {
                    console.log('📊 Distribuyendo general data:', customerData.generalData);
                    store.dispatch(GeneralDataApiActions.loadDataSuccess({ 
                        data: customerData.generalData 
                    }));
                }
                
                if (customerData.contacts) {
                    console.log('👥 Distribuyendo contacts:', customerData.contacts);
                    store.dispatch(ContactsDataApiActions.loadDataSuccess({ 
                        data: customerData.contacts 
                    }));
                }
                
                if (customerData.contract) {
                    console.log('📋 Distribuyendo contract:', customerData.contract);
                    store.dispatch(ContractDataApiActions.loadDataSuccess({ 
                        data: customerData.contract 
                    }));
                }
                
                if (customerData.commission) {
                    console.log('💰 Distribuyendo commission:', customerData.commission);
                    store.dispatch(CommissionDataApiActions.loadDataSuccess({ 
                        data: customerData.commission 
                    }));
                }
                
                if (customerData.sale) {
                    console.log('🛒 Distribuyendo sale:', customerData.sale);
                    store.dispatch(SaleDataApiActions.loadDataSuccess({ 
                        data: customerData.sale 
                    }));
                }
                
                if (customerData.billing) {
                    console.log('🧾 Distribuyendo billing:', customerData.billing);
                    store.dispatch(BillingDataApiActions.loadDataSuccess({ 
                        data: customerData.billing 
                    }));
                }
                
                if (customerData.ine) {
                    console.log('🆔 Distribuyendo ine:', customerData.ine);
                    store.dispatch(IneDataApiActions.loadDataSuccess({ 
                        data: customerData.ine 
                    }));
                }
                
                if (customerData.creditRequest) {
                    console.log('💳 Distribuyendo credit request:', customerData.creditRequest);
                    store.dispatch(CreditRequestDataApiActions.loadDataSuccess({ 
                        data: customerData.creditRequest 
                    }));
                }
                
                console.log('✅ Distribución de datos completada');
            })
        ),
    { functional: true, dispatch: false }
);

/**
 * Función de transformación para convertir la respuesta de API al formato del estado
 * Transforma ICustomer del servicio a CustomerData del NgRx state
 */
function transformCustomerResponse(customerResponse: any, customerId: string): CustomerData {
    // Extraer los datos de la respuesta real de la API
    const responseData = customerResponse?.data || customerResponse;
    
    const customerData: CustomerData = {
        id: customerId,
        // Mapear general data desde la respuesta de la API
        generalData: responseData?.generalData ? {
            personType: responseData.generalData.personType || null,
            groupType: responseData.generalData.groupType || null,
            rfc: responseData.generalData.rfc || null,
            businessName: responseData.generalData.businessName || null,
            tradeName: responseData.generalData.tradeName || null,
            street: responseData.generalData.street || null,
            exteriorNumber: responseData.generalData.exteriorNumber || null,
            interiorNumber: responseData.generalData.interiorNumber || null,
            crossing: responseData.generalData.crossing || null,
            country: responseData.generalData.country || null,
            state: responseData.generalData.state || null,
            colony: responseData.generalData.colony || null,
            municipality: responseData.generalData.municipality || null,
            postalCode: responseData.generalData.postalCode || null,
            phone: responseData.generalData.phone || null,
            city: responseData.generalData.city || null,
            fax: responseData.generalData.fax || null
        } : null,
        
        // Mapear contacts desde la respuesta de la API
        contacts: responseData?.contacts ? {
            contacts: Array.isArray(responseData.contacts.contacts) ? responseData.contacts.contacts : []
        } : null,
        
        // Mapear contract desde la respuesta de la API
        contract: responseData?.contract || null,
        
        // Mapear commission desde la respuesta de la API
        commission: responseData?.commission || null,
        
        // Mapear sale desde la respuesta de la API
        sale: responseData?.sale || null,
        
        // Mapear billing desde la respuesta de la API
        billing: responseData?.billing || null,
        
        // Mapear ine desde la respuesta de la API
        ine: responseData?.ine || null,
        
        // Mapear credit request desde la respuesta de la API
        creditRequest: responseData?.creditRequest || null
    };

    return customerData;
}
