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
import { CommissionDataPageActions, CommissionDataApiActions } from './commission.actions';
import { selectCommissionData } from './commission.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Commission Data
 */
export const loadCommissionDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CommissionDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de comisiones...');
                        return customerService.getCustomerSection(customerId, 'commissionData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de comisiones cargados exitosamente');
                                return CommissionDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(CommissionDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Commission Data
 */
export const saveCommissionDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CommissionDataPageActions.saveData),
            exhaustMap(({ customerId, data }) => {
                const toastRef = toast.loading('Guardando datos de comisiones...');
                return customerService.saveSection({
                    section: 'commissionData',
                    customerId,
                    data
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de comisiones guardados exitosamente');
                        // Crear response compatible con CommissionDataResponse
                        const commissionResponse = {
                            success: response.success,
                            data: response.data.commissionData,
                            message: response.message
                        };
                        return CommissionDataApiActions.saveDataSuccess({ 
                            data: response.data.commissionData,
                            response: commissionResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(CommissionDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Commission Data from Store
 * Obtiene los datos del store cuando no se proporcionan en la acción
 */
export const saveCommissionDataFromStoreEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CommissionDataPageActions.saveData),
            withLatestFrom(store.select(selectCommissionData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de comisión para guardar';
                    toast.error(errorMessage);
                    return of(CommissionDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                const toastRef = toast.loading('Guardando datos de comisiones...');
                
                return customerService.saveSection({
                    section: 'commissionData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de comisiones guardados exitosamente');
                        const commissionResponse = {
                            success: response.success,
                            data: response.data.commissionData,
                            message: response.message
                        };
                        return CommissionDataApiActions.saveDataSuccess({ 
                            data: response.data.commissionData,
                            response: commissionResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(CommissionDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
