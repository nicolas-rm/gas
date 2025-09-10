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

// loadContractDataEffect removido - los datos vienen del customer centralizado

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
