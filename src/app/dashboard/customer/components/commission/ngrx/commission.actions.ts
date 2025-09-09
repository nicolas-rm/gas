import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    CommissionData,
    SaveCommissionDataRequest,
    CommissionDataError,
    CommissionDataResponse
} from './commission.models';

// Acciones de UI
export const CommissionDataPageActions = createActionGroup({
    source: 'Commission Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Establecer snapshot completo del formulario
        'Set Data': props<{ data: CommissionData }>(),

        // Guardar
        'Save Data': props<SaveCommissionDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const CommissionDataApiActions = createActionGroup({
    source: 'Commission Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: CommissionData }>(),
        'Load Data Failure': props<{ error: CommissionDataError }>(),

        // Save
        'Save Data Success': props<{ data: CommissionData; response: CommissionDataResponse }>(),
        'Save Data Failure': props<{ error: CommissionDataError }>(),
    }
});
