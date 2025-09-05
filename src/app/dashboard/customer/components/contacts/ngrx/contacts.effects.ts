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

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contacts Data
 */
export const loadContactsDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.loadData),
            exhaustMap(({ customerId }) => {
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
 * Maneja el guardado de datos de contactos con datos proporcionados o del store
 */
export const saveContactsDataEffect = createEffect(
    (actions$ = inject(Actions), store = inject(Store), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsDataPageActions.saveData),
            withLatestFrom(store.select(selectContactsData)),
            exhaustMap(([action, currentData]) => {
                // Si no se proporcionan datos en la acción, usar los del store
                const dataToSave = action.data || currentData;
                if (!dataToSave) {
                    const errorMessage = 'No hay datos de contactos para guardar';
                    toast.error(errorMessage);
                    return of(ContactsDataApiActions.saveDataFailure({
                        error: { message: errorMessage }
                    }));
                }

                // Agregar pequeño delay para evitar conflictos de toast
                return timer(100).pipe(
                    exhaustMap(() => {
                        const toastRef = toast.loading('Guardando datos de contactos...');

                        return customerService.saveSection({
                            section: 'contactsData',
                            customerId: action.customerId,
                            data: dataToSave
                        }).pipe(
                            map(response => {
                                toastRef.close();
                                toast.success('Datos de contactos guardados exitosamente');
                                const contactsResponse = {
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
                                toast.error(error); // El error ya viene procesado del service
                                return of(ContactsDataApiActions.saveDataFailure({ error }));
                            })
                        );
                    })
                );
            })
        ),
    { functional: true }
);
