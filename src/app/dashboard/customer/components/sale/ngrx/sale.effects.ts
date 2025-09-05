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
import { SaleDataPageActions, SaleDataApiActions } from './sale.actions';
import { selectSaleData } from './sale.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Sale Data
 */
export const loadSaleDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de venta...');
                        return customerService.getCustomerSection(customerId, 'saleData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de venta cargados exitosamente');
                                return SaleDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(SaleDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Sale Data
 * Maneja el guardado de datos de venta con datos proporcionados o del store
 */
export const saveSaleDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.saveData),
            withLatestFrom(store.select(selectSaleData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de venta para guardar';
                    toast.error(errorMessage);
                    return of(SaleDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos de venta...');

                        return customerService.saveSection({
                            section: 'saleData',
                            customerId: action.customerId,
                            data: dataToSave
                        }).pipe(
                            map(response => {
                                toastRef.close();
                                toast.success('Datos de venta guardados exitosamente');
                                const saleResponse = {
                                    success: response.success,
                                    data: response.data.saleData,
                                    message: response.message
                                };
                                return SaleDataApiActions.saveDataSuccess({
                                    data: response.data.saleData,
                                    response: saleResponse
                                });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(SaleDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
