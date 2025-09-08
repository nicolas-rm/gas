import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    ContactsData,
    SaveContactsDataRequest,
    ContactsDataError,
    ContactsDataResponse
} from './contacts.models';

// Acciones de UI
export const ContactsDataPageActions = createActionGroup({
    source: 'Contacts Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),
        // Establecer snapshot completo
        'Set Data': props<{ data: ContactsData }>(),

        // Guardar
        'Save Data': props<SaveContactsDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const ContactsDataApiActions = createActionGroup({
    source: 'Contacts Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: ContactsData }>(),
        'Load Data Failure': props<{ error: ContactsDataError }>(),

        // Save
        'Save Data Success': props<{ data: ContactsData; response: ContactsDataResponse }>(),
        'Save Data Failure': props<{ error: ContactsDataError }>(),
    }
});
