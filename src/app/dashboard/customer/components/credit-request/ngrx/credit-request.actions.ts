import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    CreditRequestData,
    SaveCreditRequestDataRequest,
    CreditRequestDataError,
    CreditRequestDataResponse
} from './credit-request.models';

// Acciones de UI
export const CreditRequestDataPageActions = createActionGroup({
    source: 'Credit Request Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Actualizar campos
        'Update Field': props<{ field: keyof CreditRequestData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<CreditRequestData> }>(),
        'Set Data': props<{ data: CreditRequestData }>(),

        // Guardar
        'Save Data': props<SaveCreditRequestDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const CreditRequestDataApiActions = createActionGroup({
    source: 'Credit Request Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: CreditRequestData }>(),
        'Load Data Failure': props<{ error: CreditRequestDataError }>(),

        // Save
        'Save Data Success': props<{ data: CreditRequestData; response: CreditRequestDataResponse }>(),
        'Save Data Failure': props<{ error: CreditRequestDataError }>(),
    }
});
