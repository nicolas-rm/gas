import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreditRequestData, CreditRequestDataResponse, CreditRequestDataError, SaveCreditRequestDataRequest } from './credit-request.models';

// Acciones de la página/UI
export const CreditRequestDataPageActions = createActionGroup({
    source: 'Credit Request Data Page',
    events: {
        'Load Data': emptyProps(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: CreditRequestData }>(),
        'Save Data': emptyProps(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

// Acciones de la API
export const CreditRequestDataApiActions = createActionGroup({
    source: 'Credit Request Data API',
    events: {
        'Load Data Success': props<{ data: CreditRequestData }>(),
        'Load Data Failure': props<{ error: CreditRequestDataError }>(),
        'Save Data Success': props<{ data: CreditRequestData }>(),
        'Save Data Failure': props<{ error: CreditRequestDataError }>()
    }
});