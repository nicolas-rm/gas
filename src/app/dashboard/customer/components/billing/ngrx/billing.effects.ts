// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
// (Store se mantiene si en el futuro se necesita, pero actualmente no requerido)

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { BillingDataPageActions, BillingDataApiActions } from '@/dashboard/customer/components/billing/ngrx/billing.actions';
// selectBillingData removido; guardado usa datos de la acción

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Billing Data
 */
export const loadBillingDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(BillingDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando datos de facturación...');
                return customerService.getCustomerSection(customerId, 'billingData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos de facturación cargados exitosamente');
                        return BillingDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(BillingDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Billing Data
 * Maneja el guardado de datos de facturación con datos proporcionados o del store
 */
export const saveBillingDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(BillingDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos de facturación...');
                return customerService.saveSection({
                    section: 'billingData',
                    customerId: action.customerId,
                    data: action.data
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de facturación guardados exitosamente');
                        const billingResponse = {
                            success: response.success,
                            data: response.data.billingData,
                            message: response.message
                        };
                        return BillingDataApiActions.saveDataSuccess({
                            data: response.data.billingData,
                            response: billingResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(BillingDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
