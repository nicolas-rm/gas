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
import { ContactsDataPageActions, ContactsDataApiActions } from './contacts.actions';
import { selectContactsData } from './contacts.selectors';
import { selectSelectedCustomerId } from '../../../ngrx/customer.selectors';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contacts Data
 * Nota: Requiere que el customerId esté disponible en el store
 */
export const loadContactsDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.loadData),
            withLatestFrom(store.select(selectSelectedCustomerId)),
            exhaustMap(([action, customerId]) => {
                if (!customerId) {
                    const errorMessage = 'ID de cliente no disponible';
                    toast.error(errorMessage);
                    return of(ContactsDataApiActions.loadDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Cargando datos de contactos...');
                        return customerService.getCustomerSection(customerId, 'contactsData').pipe(
                            map(data => {
                                toastRef.close();
                                toast.success('Datos de contactos cargados exitosamente');
                                return ContactsDataApiActions.loadDataSuccess({ data });
                            }),
                            catchError(error => {
                                toastRef.close();
                                toast.error(error); // El error ya viene procesado del service
                                return of(ContactsDataApiActions.loadDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contacts Data
 * Obtiene los datos del store y el customerId para guardar
 */
export const saveContactsDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.saveData),
            withLatestFrom(
                store.select(selectContactsData),
                store.select(selectSelectedCustomerId)
            ),
            exhaustMap(([action, currentData, customerId]) => {
                if (!customerId) {
                    const errorMessage = 'ID de cliente no disponible';
                    toast.error(errorMessage);
                    return of(ContactsDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                if (!currentData) {
                    const errorMessage = 'No hay datos de contactos para guardar';
                    toast.error(errorMessage);
                    return of(ContactsDataApiActions.saveDataFailure({ 
                        error: { message: errorMessage }
                    }));
                }

                const toastRef = toast.loading('Guardando datos de contactos...');
                
                return customerService.saveSection({
                    section: 'contactsData',
                    customerId,
                    data: currentData
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Datos de contactos guardados exitosamente');
                        return ContactsDataApiActions.saveDataSuccess({ 
                            data: response.data.contactsData
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error); // El error ya viene procesado del service
                        return of(ContactsDataApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
