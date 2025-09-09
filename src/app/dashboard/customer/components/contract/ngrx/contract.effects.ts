// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { of, timer } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom, tap, switchMap, debounceTime, filter } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { ContractDataPageActions, ContractDataApiActions } from '@/dashboard/customer/components/contract/ngrx/contract.actions';
import { selectContractData } from '@/dashboard/customer/components/contract/ngrx/contract.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contract Data
 * Maneja la carga de datos del contrato con feedback visual
 */
export const loadContractDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.loadData),
            debounceTime(100), // Prevenir múltiples disparos rápidos
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
                        toast.error(error.message || 'Error al cargar datos del contrato');
                        return of(ContractDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contract Data
 * Maneja el guardado de datos del contrato con validación y feedback
 */
export const saveContractDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.saveData),
            withLatestFrom(store.select(selectContractData)),
            filter(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    toast.error('No hay datos de contrato para guardar');
                    return false;
                }
                return true;
            }),
            debounceTime(100), // Prevenir guardados múltiples rápidos
            exhaustMap(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                const toastRef = toast.loading('Guardando datos del contrato...');

                return customerService.saveSection({
                    section: 'contractData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos del contrato guardados exitosamente');
                        
                        const contractResponse: any = {
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
                        toast.error(error.message || 'Error al guardar datos del contrato');
                        return of(ContractDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Auto-save en respuesta a cambios de datos (opcional)
 * Este effect puede activarse automáticamente cuando los datos cambian
 */
export const autoSaveContractDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(ContractDataPageActions.setData),
            debounceTime(2000), // Auto-save después de 2 segundos de inactividad
            filter(() => {
                // Solo auto-save si está habilitado en configuración
                // Por ahora está desactivado - se puede activar más tarde
                return false;
            }),
            map(({ data }) => {
                // Necesitaríamos el customerId aquí para el auto-save
                // return ContractDataPageActions.saveData({ customerId: '...', data });
                return { type: 'NO_OP' }; // Placeholder por ahora
            })
        ),
    { functional: true }
);

/**
 * Effect: Clear errors automáticamente después de un tiempo
 */
export const clearErrorsEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(ContractDataApiActions.loadDataFailure, ContractDataApiActions.saveDataFailure),
            debounceTime(5000), // Limpiar errores después de 5 segundos
            map(() => ContractDataPageActions.clearErrors())
        ),
    { functional: true }
);
