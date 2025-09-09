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
import { IneDataPageActions, IneDataApiActions } from '@/dashboard/customer/components/ine/ngrx/ine.actions';
import { selectIneData } from '@/dashboard/customer/components/ine/ngrx/ine.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load INE Data
 * Maneja la carga de datos de INE con feedback visual
 */
export const loadIneDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(IneDataPageActions.loadData),
            debounceTime(100), // Prevenir múltiples disparos rápidos
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
                        toast.error(error.message || 'Error al cargar datos de INE');
                        return of(IneDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save INE Data
 * Maneja el guardado de datos de INE con validación y feedback
 */
export const saveIneDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(IneDataPageActions.saveData),
            withLatestFrom(store.select(selectIneData)),
            filter(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    toast.error('No hay datos de INE para guardar');
                    return false;
                }
                return true;
            }),
            debounceTime(100), // Prevenir guardados múltiples rápidos
            exhaustMap(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                const toastRef = toast.loading('Guardando datos de INE...');

                return customerService.saveSection({
                    section: 'ineData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de INE guardados exitosamente');
                        
                        const ineResponse: any = {
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
                        toast.error(error.message || 'Error al guardar datos de INE');
                        return of(IneDataApiActions.saveDataFailure({ error }));
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
export const autoSaveIneDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(IneDataPageActions.setData),
            debounceTime(2000), // Auto-save después de 2 segundos de inactividad
            filter(() => {
                // Solo auto-save si está habilitado en configuración
                // Por ahora está desactivado - se puede activar más tarde
                return false;
            }),
            map(({ data }) => {
                // Necesitaríamos el customerId aquí para el auto-save
                // return IneDataPageActions.saveData({ customerId: '...', data });
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
            ofType(IneDataApiActions.loadDataFailure, IneDataApiActions.saveDataFailure),
            debounceTime(5000), // Limpiar errores después de 5 segundos
            map(() => IneDataPageActions.clearErrors())
        ),
    { functional: true }
);
