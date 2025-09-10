// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { IneDataPageActions, IneDataApiActions } from '@/dashboard/customer/components/ine/ngrx/ine.actions';

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
                const toastRef = toast.loading('Cargando datos de INE...');
                return customerService.getCustomerSection(customerId, 'ineData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos de INE cargados exitosamente');
                        return IneDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(IneDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save INE Data
 */
export const saveIneDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(IneDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos de INE...');
                return customerService.saveSection({
                    section: 'ineData',
                    customerId: action.customerId,
                    data: action.data
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
                        toast.error(error);
                        return of(IneDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
