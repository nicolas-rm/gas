// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { of, timer } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '../../../customer.service';
import { BillingDataPageActions, BillingDataApiActions } from './billing.actions';
import { selectBillingData } from './billing.selectors';

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
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de facturación...');
                        return customerService.getCustomerSection(customerId, 'billingData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de facturación cargados exitosamente');
                                return BillingDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(BillingDataApiActions.loadDataFailure({ error }));
                            })
                        );
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
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(BillingDataPageActions.saveData),
            withLatestFrom(store.select(selectBillingData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de facturación para guardar';
                    toast.error(errorMessage);
                    return of(BillingDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos de facturación...');

                        return customerService.saveSection({
                            section: 'billingData',
                            customerId: action.customerId,
                            data: dataToSave
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
                                toast.error(error); // El error ya viene procesado del service
                                return of(BillingDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
