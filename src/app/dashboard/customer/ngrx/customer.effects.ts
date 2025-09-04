import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { CustomerUIActions, CustomerAPIActions } from './customer.actions';
import { CustomerService } from '../customer.service';
import { selectSelectedCustomerId, selectSelectedCustomer } from './customer.selectors';
import { ICustomer, SaveFormRequest } from './customer.models';
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load single customer
 */
export const loadCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.loadCustomer),
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando cliente...');
                return customerService.getCustomer(customerId).pipe(
                    map(customer => {
                        toastRef.close();
                        toast.success('Cliente cargado exitosamente');
                        return CustomerAPIActions.loadCustomerSuccess({ customer });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al cargar el cliente');
                        return of(CustomerAPIActions.loadCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Load all customers
 */
export const loadCustomersEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.loadCustomers),
            exhaustMap(() => {
                const toastRef = toast.loading('Cargando clientes...');
                return customerService.getCustomers().pipe(
                    map(customers => {
                        toastRef.close();
                        toast.success(`${customers.length} clientes cargados`);
                        return CustomerAPIActions.loadCustomersSuccess({ customers });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al cargar los clientes');
                        return of(CustomerAPIActions.loadCustomersFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save customer section
 */
export const saveSectionEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.saveSection),
            exhaustMap(({ request }) => {
                const toastRef = toast.loading(`Guardando ${request.section}...`);
                return customerService.saveSection(request).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success(`${request.section} guardado exitosamente`);
                        return CustomerAPIActions.saveSectionSuccess({
                            section: request.section,
                            data: response.data
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(`Error al guardar ${request.section}`);
                        return of(CustomerAPIActions.saveSectionFailure({
                            section: request.section,
                            error
                        }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Create customer
 */
export const createCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.createCustomer),
            exhaustMap(({ customer }) => {
                const toastRef = toast.loading('Creando cliente...');
                return customerService.createCustomer(customer).pipe(
                    map(createdCustomer => {
                        toastRef.close();
                        toast.success('Cliente creado exitosamente');
                        return CustomerAPIActions.createCustomerSuccess({ customer: createdCustomer });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al crear el cliente');
                        return of(CustomerAPIActions.createCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Update customer
 */
export const updateCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.updateCustomer),
            exhaustMap(({ customerId, updates }) => {
                const toastRef = toast.loading('Actualizando cliente...');
                return customerService.updateCustomer(customerId, updates).pipe(
                    map(updatedCustomer => {
                        toastRef.close();
                        toast.success('Cliente actualizado exitosamente');
                        return CustomerAPIActions.updateCustomerSuccess({ customer: updatedCustomer });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al actualizar el cliente');
                        return of(CustomerAPIActions.updateCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Delete customer
 */
export const deleteCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.deleteCustomer),
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Eliminando cliente...');
                return customerService.deleteCustomer(customerId).pipe(
                    map(() => {
                        toastRef.close();
                        toast.success('Cliente eliminado exitosamente');
                        return CustomerAPIActions.deleteCustomerSuccess({ customerId });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al eliminar el cliente');
                        return of(CustomerAPIActions.deleteCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save complete customer
 */
export const saveCustomerEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.saveCustomer),
            exhaustMap(({ customer }) => {
                const toastRef = toast.loading('Guardando cliente completo...');
                return customerService.saveCustomer(customer).pipe(
                    map(savedCustomer => {
                        toastRef.close();
                        toast.success('Cliente guardado exitosamente');
                        return CustomerAPIActions.saveCustomerSuccess({ customer: savedCustomer });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error('Error al guardar el cliente');
                        return of(CustomerAPIActions.saveCustomerFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

// UI Action Effects (Mappers - sin toast)

/**
 * Effect: Select customer (triggers load)
 */
export const selectCustomerEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(CustomerUIActions.selectCustomer),
            map(({ customerId }) => CustomerAPIActions.loadCustomer({ customerId }))
        ),
    { functional: true }
);

/**
 * Effect: Save section requested (triggers save)
 */
export const saveSectionRequestedEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(CustomerUIActions.saveSectionRequested),
            withLatestFrom(store.select(selectSelectedCustomerId)),
            map(([{ section, data }, customerId]) => {
                const request: SaveFormRequest = {
                    section,
                    data,
                    customerId: customerId || undefined
                };
                return CustomerAPIActions.saveSection({ request });
            })
        ),
    { functional: true }
);

/**
 * Effect: Create customer requested
 * NOTA: La acción UI no tiene customer data, se debe obtener del estado del formulario
 */
export const createCustomerRequestedEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(CustomerUIActions.createCustomerRequested),
            withLatestFrom(store.select(selectSelectedCustomer)),
            map(([action, selectedCustomer]) => {
                // Si hay un customer seleccionado, usarlo como base, sino objeto vacío
                const customer: Partial<ICustomer> = selectedCustomer || {};
                return CustomerAPIActions.createCustomer({ customer });
            })
        ),
    { functional: true }
);

/**
 * Effect: Update customer requested
 */
export const updateCustomerRequestedEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store)) =>
        actions$.pipe(
            ofType(CustomerUIActions.updateCustomerRequested),
            withLatestFrom(store.select(selectSelectedCustomer)),
            map(([{ customerId }, selectedCustomer]) => {
                // Usar los datos del customer seleccionado como updates
                const updates: Partial<ICustomer> = selectedCustomer || {};
                return CustomerAPIActions.updateCustomer({ customerId, updates });
            })
        ),
    { functional: true }
);

/**
 * Effect: Delete customer requested
 */
export const deleteCustomerRequestedEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(CustomerUIActions.deleteCustomerRequested),
            map(({ customerId }) => CustomerAPIActions.deleteCustomer({ customerId }))
        ),
    { functional: true }
);

// Navigation Effects (sin dispatch)

/**
 * Effect: Navigate after customer creation success
 */
export const createCustomerSuccessNavEffect = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.createCustomerSuccess),
            tap(({ customer }) => {
                void router.navigate(['/panel/customer/show', customer.id]);
            })
        ),
    { functional: true, dispatch: false }
);

/**
 * Effect: Navigate after customer deletion success
 */
export const deleteCustomerSuccessNavEffect = createEffect(
    (actions$ = inject(Actions), router = inject(Router)) =>
        actions$.pipe(
            ofType(CustomerAPIActions.deleteCustomerSuccess),
            tap(() => {
                void router.navigate(['/panel/customer']);
            })
        ),
    { functional: true, dispatch: false }
);


// Exportar todos los efectos como CustomerEffects
export const CustomerEffects = {
    loadCustomerEffect,
    loadCustomersEffect,
    saveSectionEffect,
    createCustomerEffect,
    updateCustomerEffect,
    deleteCustomerEffect,
    saveCustomerEffect,
    selectCustomerEffect,
    saveSectionRequestedEffect,
    createCustomerRequestedEffect,
    updateCustomerRequestedEffect,
    deleteCustomerRequestedEffect,
    createCustomerSuccessNavEffect,
    deleteCustomerSuccessNavEffect
};
