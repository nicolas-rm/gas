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
import { IneDataPageActions, IneDataApiActions } from './ine.actions';
import { selectIneData } from './ine.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load INE Data
 */
export const loadIneDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(IneDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de INE...');
                        return customerService.getCustomerSection(customerId, 'ineData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de INE cargados exitosamente');
                                return IneDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(IneDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save INE Data
 * Maneja el guardado de datos de INE con datos proporcionados o del store
 */
export const saveIneDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(IneDataPageActions.saveData),
            withLatestFrom(store.select(selectIneData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de INE para guardar';
                    toast.error(errorMessage);
                    return of(IneDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos de INE...');

                        return customerService.saveSection({
                            section: 'ineData',
                            customerId: action.customerId,
                            data: dataToSave
                        }).pipe(
                            map(response => {
                                toastRef.close();
                                toast.success('Datos de INE guardados exitosamente');
                                const ineResponse = {
                                    success: response.success,
                                    data: response.data.ineData,
                                    message: response.message
                                };
                                return IneDataApiActions.saveDataSuccess({
                                    data: response.data.ineData,
                                    response: ineResponse
                                });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(IneDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
