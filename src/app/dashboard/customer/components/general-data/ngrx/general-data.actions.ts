import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    GeneralData,
    SaveGeneralDataRequest,
    GeneralDataError,
    GeneralDataResponse
} from './general-data.models';

// Acciones de UI
export const GeneralDataPageActions = createActionGroup({
    source: 'General Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Actualizar campos
        'Update Field': props<{ field: keyof GeneralData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<GeneralData> }>(),
        'Set Data': props<{ data: GeneralData }>(),

        // Guardar
        'Save Data': props<SaveGeneralDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const GeneralDataApiActions = createActionGroup({
    source: 'General Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: GeneralData }>(),
        'Load Data Failure': props<{ error: GeneralDataError }>(),

        // Save
        'Save Data Success': props<{ data: GeneralData; response: GeneralDataResponse }>(),
        'Save Data Failure': props<{ error: GeneralDataError }>(),
    }
});
