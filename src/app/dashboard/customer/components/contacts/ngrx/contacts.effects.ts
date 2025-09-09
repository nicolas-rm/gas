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
import { ContactsDataPageActions, ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { selectContactsData } from '@/dashboard/customer/components/contacts/ngrx/contacts.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contacts Data
 * Maneja la carga de datos de contactos con feedback visual
 */
export const loadContactsDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.loadData),
            debounceTime(100), // Prevenir múltiples disparos rápidos
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando contactos...');
                
                return customerService.getCustomerSection(customerId, 'contactsData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Contactos cargados exitosamente');
                        return ContactsDataApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error.message || 'Error al cargar contactos');
                        return of(ContactsDataApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contacts Data
 * Maneja el guardado de datos de contactos con validación y feedback
 */
export const saveContactsDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.saveData),
            withLatestFrom(store.select(selectContactsData)),
            filter(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    toast.error('No hay datos de contactos para guardar');
                    return false;
                }
                return true;
            }),
            debounceTime(100), // Prevenir guardados múltiples rápidos
            exhaustMap(([action, currentData]) => {
                const dataToSave = action.data || currentData;
                const toastRef = toast.loading('Guardando contactos...');

                return customerService.saveSection({
                    section: 'contactsData',
                    customerId: action.customerId,
                    data: dataToSave
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Contactos guardados exitosamente');
                        
                        const contactsResponse: any = {
                            success: response.success,
                            data: response.data.contactsData,
                            message: response.message
                        };
                        
                        return ContactsDataApiActions.saveDataSuccess({
                            data: response.data.contactsData,
                            response: contactsResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error.message || 'Error al guardar contactos');
                        return of(ContactsDataApiActions.saveDataFailure({ error }));
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
export const autoSaveContactsDataEffect = createEffect(
    (actions$ = inject(Actions)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.setData),
            debounceTime(2000), // Auto-save después de 2 segundos de inactividad
            filter(() => {
                // Solo auto-save si está habilitado en configuración
                // Por ahora está desactivado - se puede activar más tarde
                return false;
            }),
            map(({ data }) => {
                // Necesitaríamos el customerId aquí para el auto-save
                // return ContactsDataPageActions.saveData({ customerId: '...', data });
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
            ofType(ContactsDataApiActions.loadDataFailure, ContactsDataApiActions.saveDataFailure),
            debounceTime(5000), // Limpiar errores después de 5 segundos
            map(() => ContactsDataPageActions.clearErrors())
        ),
    { functional: true }
);
