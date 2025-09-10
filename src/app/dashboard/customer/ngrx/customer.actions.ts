import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    CustomerData,
    CustomerViewMode,
    CustomerDataError
} from './customer.models';

// Acciones de UI
export const CustomerPageActions = createActionGroup({
    source: 'Customer Page',
    events: {
        // Configuración de vista
        'Set View Mode': props<{ viewMode: CustomerViewMode }>(),
        'Set Current Customer': props<{ customerId: string }>(),
        'Clear Current Customer': emptyProps(),
        
        // Cargar datos del cliente completo
        'Load Customer': props<{ customerId: string }>(),
        
        // Distribuir datos a tabs
        'Distribute Customer Data': props<{ customerData: CustomerData }>(),
        
        // Reset y limpieza
        'Clear Errors': emptyProps(),
    }
});

// Acciones de API
export const CustomerApiActions = createActionGroup({
    source: 'Customer API',
    events: {
        // Load
        'Load Customer Success': props<{ customerData: CustomerData }>(),
        'Load Customer Failure': props<{ error: CustomerDataError }>(),
    }
});
