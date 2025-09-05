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
import { ContractDataPageActions, ContractDataApiActions } from './contract.actions';
import { selectContractData } from './contract.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contract Data
 */
export const loadContractDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos del contrato...');
                        return customerService.getCustomerSection(customerId, 'contractData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos del contrato cargados exitosamente');
                                return ContractDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(ContractDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contract Data
 */
export const saveContractDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.saveData),
            exhaustMap(({ customerId, data }) => {
                const toastRef = toast.loading('Guardando datos del contrato...');
                return customerService.saveSection({
                    section: 'contractData',
                    customerId,
                    data
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos del contrato guardados exitosamente');
                        // Crear response compatible con ContractDataResponse
                        const contractResponse = {
                            success: response.success,
                            data: response.data.contractData,
                            message: response.message
                        };
                        return ContractDataApiActions.saveDataSuccess({ 
                            data: response.data.contractData,
                            response: contractResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(ContractDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contract Data from Store
 * Obtiene los datos del store cuando no se proporcionan en la acción
 */
export const saveContractDataFromStoreEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.saveData),
            withLatestFrom(store.select(selectContractData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de contrato para guardar';
                    toast.error(errorMessage);
                    return of(ContractDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                const toastRef = toast.loading('Guardando datos del contrato...');
                
                return customerService.saveSection({
                    section: 'contractData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos del contrato guardados exitosamente');
                        const contractResponse = {
                            success: response.success,
                            data: response.data.contractData,
                            message: response.message
                        };
                        return ContractDataApiActions.saveDataSuccess({ 
                            data: response.data.contractData,
                            response: contractResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(ContractDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
