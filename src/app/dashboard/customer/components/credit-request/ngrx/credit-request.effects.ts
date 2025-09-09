// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

// RxJS
import { of, timer } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom, debounceTime, filter } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { CreditRequestDataPageActions, CreditRequestDataApiActions } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.actions';
import { selectCreditRequestData } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Credit Request Data
 * Maneja la carga de datos de solicitud de crédito con feedback visual
 */
export const loadCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.loadData),
            debounceTime(100), // Prevenir múltiples disparos rápidos
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando datos de solicitud de crédito...');
                
                return customerService.getCustomerSection(customerId, 'creditRequestData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Datos de solicitud de crédito cargados exitosamente');
                        return CreditRequestDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error.message || 'Error al cargar datos de solicitud de crédito');
                        return of(CreditRequestDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Credit Request Data
 * Maneja el guardado de datos de solicitud de crédito con validación y feedback
 */
export const saveCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.saveData),
            withLatestFrom(store.select(selectCreditRequestData)),
            filter(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    toast.error('No hay datos de solicitud de crédito para guardar');
                    return false;
                }
                return true;
            }),
            debounceTime(100), // Prevenir guardados múltiples rápidos
            exhaustMap(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                const toastRef = toast.loading('Guardando datos de solicitud de crédito...');

                return customerService.saveSection({
                    section: 'creditRequestData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de solicitud de crédito guardados exitosamente');
                        
                        const creditRequestResponse: any = {
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
                        toast.error(error.message || 'Error al guardar datos de solicitud de crédito');
                        return of(CreditRequestDataApiActions.saveDataFailure({ error }));
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
export const autoSaveCreditRequestDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(CreditRequestDataPageActions.setData),
            debounceTime(2000), // Auto-save después de 2 segundos de inactividad
            filter(() => {
                // Solo auto-save si está habilitado en configuración
                // Por ahora está desactivado - se puede activar más tarde
                return false;
            }),
            map(({ data }) => {
                // Necesitaríamos el customerId aquí para el auto-save
                // return CreditRequestDataPageActions.saveData({ customerId: '...', data });
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
            ofType(CreditRequestDataApiActions.loadDataFailure, CreditRequestDataApiActions.saveDataFailure),
            debounceTime(5000), // Limpiar errores después de 5 segundos
            map(() => CreditRequestDataPageActions.clearErrors())
        ),
    { functional: true }
);
