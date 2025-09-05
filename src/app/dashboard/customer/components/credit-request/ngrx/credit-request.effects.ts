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
import { CreditRequestDataPageActions, CreditRequestDataApiActions } from './credit-request.actions';
import { selectCreditRequestData } from './credit-request.selectors';
import { selectSelectedCustomerId } from '../../../ngrx/customer.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Credit Request Data
 * Nota: Requiere que el customerId esté disponible en el store
 */
export const loadCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.loadData),
            withLatestFrom(store.select(selectSelectedCustomerId)),
            exhaustMap(([action, customerId]) => {
                if (!customerId) {
                    const errorMessage = 'ID de cliente no disponible';
                    toast.error(errorMessage);
                    return of(CreditRequestDataApiActions.loadDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de solicitud de crédito...');
                        return customerService.getCustomerSection(customerId, 'creditRequestData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de solicitud de crédito cargados exitosamente');
                                return CreditRequestDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(CreditRequestDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Credit Request Data
 * Obtiene los datos del store y el customerId para guardar
 */
export const saveCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.saveData),
            withLatestFrom(
                store.select(selectCreditRequestData),
                store.select(selectSelectedCustomerId)
            ),
            exhaustMap(([action, currentData, customerId]) => {
                if (!customerId) {
                    const errorMessage = 'ID de cliente no disponible';
                    toast.error(errorMessage);
                    return of(CreditRequestDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                if (!currentData) {
                    const errorMessage = 'No hay datos de solicitud de crédito para guardar';
                    toast.error(errorMessage);
                    return of(CreditRequestDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                const toastRef = toast.loading('Guardando datos de solicitud de crédito...');
                
                return customerService.saveSection({
                    section: 'creditRequestData',
                    customerId,
                    data: currentData
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de solicitud de crédito guardados exitosamente');
                        return CreditRequestDataApiActions.saveDataSuccess({ 
                            data: response.data.creditRequestData
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(CreditRequestDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
