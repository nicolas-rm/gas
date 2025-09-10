// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { CommissionDataPageActions, CommissionDataApiActions } from '@/dashboard/customer/components/commission/ngrx/commission.actions';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

// loadCommissionDataEffect removido - los datos vienen del customer centralizado

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
