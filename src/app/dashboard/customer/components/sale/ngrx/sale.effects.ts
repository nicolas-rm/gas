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
import { SaleDataPageActions, SaleDataApiActions } from '@/dashboard/customer/components/sale/ngrx/sale.actions';
import { selectSaleData } from '@/dashboard/customer/components/sale/ngrx/sale.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Sale Data
 * Maneja la carga de datos de venta con feedback visual
 */
export const loadSaleDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.loadData),
            debounceTime(100), // Prevenir múltiples disparos rápidos
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
                        toast.error(error.message || 'Error al cargar datos de venta');
                        return of(SaleDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Sale Data
 * Maneja el guardado de datos de venta con validación y feedback
 */
export const saveSaleDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.saveData),
            withLatestFrom(store.select(selectSaleData)),
            filter(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    toast.error('No hay datos de venta para guardar');
                    return false;
                }
                return true;
            }),
            debounceTime(100), // Prevenir guardados múltiples rápidos
            exhaustMap(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                const toastRef = toast.loading('Guardando datos de venta...');

                return customerService.saveSection({
                    section: 'saleData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de venta guardados exitosamente');
                        
                        const saleResponse: any = {
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
                        toast.error(error.message || 'Error al guardar datos de venta');
                        return of(SaleDataApiActions.saveDataFailure({ error }));
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
export const autoSaveSaleDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(SaleDataPageActions.setData),
            debounceTime(2000), // Auto-save después de 2 segundos de inactividad
            filter(() => {
                // Solo auto-save si está habilitado en configuración
                // Por ahora está desactivado - se puede activar más tarde
                return false;
            }),
            map(({ data }) => {
                // Necesitaríamos el customerId aquí para el auto-save
                // return SaleDataPageActions.saveData({ customerId: '...', data });
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
            ofType(SaleDataApiActions.loadDataFailure, SaleDataApiActions.saveDataFailure),
            debounceTime(5000), // Limpiar errores después de 5 segundos
            map(() => SaleDataPageActions.clearErrors())
        ),
    { functional: true }
);
