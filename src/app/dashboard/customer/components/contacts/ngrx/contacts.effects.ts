// Angular
import { inject } from '@angular/core';

// NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';

// RxJS
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

// Servicios y modelos propios
import { CustomerService } from '@/dashboard/customer/customer.service';
import { ContactsPageActions, ContactsApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Effect: Load Contacts Data
 */
export const loadContactsDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsPageActions.loadData),
            exhaustMap(({ customerId }) => {
                const toastRef = toast.loading('Cargando contactos...');
                return customerService.getCustomerSection(customerId, 'contactsData').pipe(
                    map(data => {
                        toastRef.close();
                        toast.success('Contactos cargados exitosamente');
                        return ContactsApiActions.loadDataSuccess({ data });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(ContactsApiActions.loadDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);

/**
 * Effect: Save Contacts Data
 * Maneja el guardado de contactos con datos proporcionados o del store
 */
export const saveContactsDataEffect = createEffect(
    (actions$ = inject(Actions), customerService = inject(CustomerService), toast = inject(HotToastService)) =>
        actions$.pipe(
            ofType(ContactsPageActions.saveData),
            exhaustMap(action => {
                const toastRef = toast.loading('Guardando contactos...');
                return customerService.saveSection({
                    section: 'contactsData',
                    customerId: action.customerId,
                    data: action.data
                }).pipe(
                    map(response => {
                        toastRef.close();
                        toast.success('Contactos guardados exitosamente');
                        const contactsResponse = {
                            success: response.success,
                            data: response.data.contactsData,
                            message: response.message
                        };
                        return ContactsApiActions.saveDataSuccess({
                            data: response.data.contactsData,
                            response: contactsResponse
                        });
                    }),
                    catchError(error => {
                        toastRef.close();
                        toast.error(error);
                        return of(ContactsApiActions.saveDataFailure({ error }));
                    })
                );
            })
        ),
    { functional: true }
);
