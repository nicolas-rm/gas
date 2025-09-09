import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    CreditRequestData,
    SaveCreditRequestDataRequest,
    CreditRequestDataError,
    CreditRequestDataResponse
} from './credit-request.models';

// Acciones de página (UI) - Siguiendo el estándar de general-data
export const CreditRequestDataPageActions = createActionGroup({
    source: 'Credit Request Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),
        
        // Establecer snapshot completo (la única forma de cambiar datos)
        'Set Data': props<{ data: CreditRequestData }>(),

        // Guardar datos (con datos opcionales, si no se proveen usa los del store)
        'Save Data': props<{ customerId: string; data?: CreditRequestData }>(),

        // Operaciones de formulario
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API - Respuestas del backend
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
