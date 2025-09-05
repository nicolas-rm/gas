// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { of, timer } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { GeneralDataPageActions, GeneralDataApiActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';
import { selectGeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load General Data
 */
export const loadGeneralDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(GeneralDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos generales...');
                        return customerService.getCustomerSection(customerId, 'generalData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos generales cargados exitosamente');
                                return GeneralDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(GeneralDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save General Data
 * Maneja el guardado de datos generales con datos proporcionados o del store
 */
export const saveGeneralDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(GeneralDataPageActions.saveData),
            withLatestFrom(store.select(selectGeneralData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de general data para guardar';
                    toast.error(errorMessage);
                    return of(GeneralDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos generales...');

                        return customerService.saveSection({
                            section: 'generalData',
                            customerId: action.customerId,
                            data: dataToSave
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
                                toast.error(error); // El error ya viene procesado del service
                                return of(GeneralDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
