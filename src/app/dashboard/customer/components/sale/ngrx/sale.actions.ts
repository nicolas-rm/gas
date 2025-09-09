import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    SaleData,
    SaveSaleDataRequest,
    SaleDataError,
    SaleDataResponse
} from '@/dashboard/customer/components/sale/ngrx/sale.models';

// Acciones de UI
export const SaleDataPageActions = createActionGroup({
    source: 'Sale Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Establecer snapshot completo del formulario
        'Set Data': props<{ data: SaleData }>(),

        // Guardar
        'Save Data': props<SaveSaleDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const SaleDataApiActions = createActionGroup({
    source: 'Sale Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: SaleData }>(),
        'Load Data Failure': props<{ error: SaleDataError }>(),

        // Save
        'Save Data Success': props<{ data: SaleData; response: SaleDataResponse }>(),
        'Save Data Failure': props<{ error: SaleDataError }>(),
    }
});
