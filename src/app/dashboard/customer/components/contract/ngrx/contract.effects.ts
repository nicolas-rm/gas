// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { ContractDataPageActions, ContractDataApiActions } from '@/dashboard/customer/components/contract/ngrx/contract.actions';

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
                const toastRef = toast.loading('Cargando datos del contrato...');
                return customerService.getCustomerSection(customerId, 'contractData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos del contrato cargados exitosamente');
                        return ContractDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(ContractDataApiActions.loadDataFailure({ error }));
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
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando datos del contrato...');
                return customerService.saveSection({
                    section: 'contractData',
                    customerId: action.customerId,
                    data: action.data
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
                        toast.error(error);
                        return of(ContractDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
