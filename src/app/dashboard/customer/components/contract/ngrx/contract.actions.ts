import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    ContractData,
    SaveContractDataRequest,
    ContractDataError,
    ContractDataResponse
} from './contract.models';

// Acciones de UI
export const ContractDataPageActions = createActionGroup({
    source: 'Contract Data Page',
    events: {
        // Cargar datos
        'Load Data': props<{ customerId: string }>(),

        // Actualizar campos
        'Update Field': props<{ field: keyof ContractData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<ContractData> }>(),
        'Set Data': props<{ data: ContractData }>(),

        // Guardar
        'Save Data': props<SaveContractDataRequest>(),

        // Reset y limpieza
        'Reset Form': emptyProps(),
        'Reset To Original': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

// Acciones de API
export const ContractDataApiActions = createActionGroup({
    source: 'Contract Data API',
    events: {
        // Load
        'Load Data Success': props<{ data: ContractData }>(),
        'Load Data Failure': props<{ error: ContractDataError }>(),

        // Save
        'Save Data Success': props<{ data: ContractData; response: ContractDataResponse }>(),
        'Save Data Failure': props<{ error: ContractDataError }>(),
    }
});
