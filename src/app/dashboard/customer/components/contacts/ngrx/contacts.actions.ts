import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    ContactsData,
    SaveContactsDataRequest,
    ContactsDataError,
    ContactsDataResponse
} from './contacts.models';

// Acciones de página (UI) - Siguiendo el estándar de general-data
export const ContactsDataPageActions = createActionGroup({
    source: 'Contacts Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),
        
        // Establecer snapshot completo (la única forma de cambiar datos)
        'Set Data': props<{ data: ContactsData }>(),

        // Guardar datos (con datos opcionales, si no se proveen usa los del store)
        'Save Data': props<{ customerId: string; data?: ContactsData }>(),

        // Operaciones de formulario
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API - Respuestas del backend
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
