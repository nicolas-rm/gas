// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { SaleDataPageActions, SaleDataApiActions } from '@/dashboard/customer/components/sale/ngrx/sale.actions';

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
                const toastRef = toast.loading('Cargando datos de venta...');
                return customerService.getCustomerSection(customerId, 'saleData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos de venta cargados exitosamente');
                        return SaleDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(SaleDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Sale Data
 */
export const saveSaleDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos de venta...');
                return customerService.saveSection({
                    section: 'saleData',
                    customerId: action.customerId,
                    data: action.data
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
                        toast.error(error);
                        return of(SaleDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
