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
import { CommissionDataPageActions, CommissionDataApiActions } from '@/dashboard/customer/components/commission/ngrx/commission.actions';
// selectCommissionData removido; guardado usa datos de la acción

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
                const toastRef = toast.loading('Cargando datos de comisiones...');
                return customerService.getCustomerSection(customerId, 'commissionData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos de comisiones cargados exitosamente');
                        return CommissionDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(CommissionDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Commission Data
 * Maneja el guardado de datos de comisiones con datos proporcionados o del store
 */
export const saveCommissionDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CommissionDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos de comisiones...');
                return customerService.saveSection({
                    section: 'commissionData',
                    customerId: action.customerId,
                    data: action.data
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
                        toast.error(error);
                        return of(CommissionDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
