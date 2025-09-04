import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ContactsData, ContactsDataResponse, ContactsDataError, SaveContactsDataRequest } from './contacts.models';

// Acciones de la página/UI
export const ContactsDataPageActions = createActionGroup({
    source: 'Contacts Data Page',
    events: {
        'Load Data': emptyProps(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: ContactsData }>(),
        'Save Data': emptyProps(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

// Acciones de la API
export const ContactsDataApiActions = createActionGroup({
    source: 'Contacts Data API',
    events: {
        'Load Data Success': props<{ data: ContactsData }>(),
        'Load Data Failure': props<{ error: ContactsDataError }>(),
        'Save Data Success': props<{ data: ContactsData }>(),
        'Save Data Failure': props<{ error: ContactsDataError }>()
    }
});