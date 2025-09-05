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

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Credit Request Data
 */
export const loadCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
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
 * Maneja el guardado de datos de solicitud de crédito con datos proporcionados o del store
 */
export const saveCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.saveData),
            withLatestFrom(store.select(selectCreditRequestData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de solicitud de crédito para guardar';
                    toast.error(errorMessage);
                    return of(CreditRequestDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos de solicitud de crédito...');

                        return customerService.saveSection({
                            section: 'creditRequestData',
                            customerId: action.customerId,
                            data: dataToSave
                        }).pipe(
                            map(response => {
                                toastRef.close();
                                toast.success('Datos de solicitud de crédito guardados exitosamente');
                                const creditRequestResponse = {
                                    success: response.success,
                                    data: response.data.creditRequestData,
                                    message: response.message
                                };
                                return CreditRequestDataApiActions.saveDataSuccess({
                                    data: response.data.creditRequestData,
                                    response: creditRequestResponse
                                });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(CreditRequestDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
