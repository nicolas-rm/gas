// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { CreditRequestDataPageActions, CreditRequestDataApiActions } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.actions';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

// loadCreditRequestDataEffect removido - los datos vienen del customer centralizado

/**
 * Effect: Save Credit Request Data
 */
export const saveCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos de solicitud de crédito...');
                return customerService.saveSection({
                    section: 'creditRequestData',
                    customerId: action.customerId,
                    data: action.data
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
                        toast.error(error);
                        return of(CreditRequestDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
