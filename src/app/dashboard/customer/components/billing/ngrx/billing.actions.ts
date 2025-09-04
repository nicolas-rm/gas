import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    BillingData,
    SaveBillingDataRequest,
    BillingDataError,
    BillingDataResponse
} from './billing.models';

// Acciones de UI
export const BillingDataPageActions = createActionGroup({
    source: 'Billing Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Actualizar campos
        'Update Field': props<{ field: keyof BillingData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<BillingData> }>(),
        'Set Data': props<{ data: BillingData }>(),

        // Guardar
        'Save Data': props<SaveBillingDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const BillingDataApiActions = createActionGroup({
    source: 'Billing Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: BillingData }>(),
        'Load Data Failure': props<{ error: BillingDataError }>(),

        // Save
        'Save Data Success': props<{ data: BillingData; response: BillingDataResponse }>(),
        'Save Data Failure': props<{ error: BillingDataError }>(),
    }
});