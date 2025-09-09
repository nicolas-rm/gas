import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    IneData,
    SaveIneDataRequest,
    IneDataError,
    IneDataResponse
} from '@/dashboard/customer/components/ine/ngrx/ine.models';

// Acciones de UI
export const IneDataPageActions = createActionGroup({
    source: 'Ine Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Establecer snapshot completo del formulario
        'Set Data': props<{ data: IneData }>(),

        // Guardar
        'Save Data': props<SaveIneDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const IneDataApiActions = createActionGroup({
    source: 'Ine Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: IneData }>(),
        'Load Data Failure': props<{ error: IneDataError }>(),

        // Save
        'Save Data Success': props<{ data: IneData; response: IneDataResponse }>(),
        'Save Data Failure': props<{ error: IneDataError }>(),
    }
});
