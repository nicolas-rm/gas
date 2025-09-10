// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { GeneralDataPageActions, GeneralDataApiActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

// loadGeneralDataEffect removido - los datos vienen del customer centralizado

/**
 * Effect: Save General Data
 * Maneja el guardado de datos generales con datos proporcionados o del store
 */
export const saveGeneralDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(GeneralDataPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos generales...');
                return customerService.saveSection({
                    section: 'generalData',
                    customerId: action.customerId,
                    data: action.data
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos generales guardados exitosamente');
                        const generalResponse = {
                            success: response.success,
                            data: response.data.generalData,
                            message: response.message
                        };
                        return GeneralDataApiActions.saveDataSuccess({
                            data: response.data.generalData,
                            response: generalResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(GeneralDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
