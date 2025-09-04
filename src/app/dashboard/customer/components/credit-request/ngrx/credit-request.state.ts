import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CreditRequestData } from './credit-request.models';

// Estados operacionales específicos siguiendo el estándar de general-data
export type CreditRequestDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario Credit Request siguiendo el estándar
export interface CreditRequestDataState extends EntityState<CreditRequestData> {
    // Datos del formulario
    data: CreditRequestData;
    
    // Estados operacionales
    status: CreditRequestDataStatus;
    
    // Estados de carga y guardado
    loading: boolean;
    saving: boolean;
    
    // Manejo de errores
    error: string | null;
    
    // Control de cambios
    hasUnsavedChanges: boolean;
    isDirty: boolean;
    
    // Metadatos
    lastSaved: string | null;
}

// Entity Adapter
export const creditRequestDataAdapter: EntityAdapter<CreditRequestData> = createEntityAdapter<CreditRequestData>({
    selectId: () => 'creditRequest' // Solo hay un registro de credit request por customer
});

// Estado inicial
export const initialCreditRequestDataState: CreditRequestDataState = creditRequestDataAdapter.getInitialState({
    data: {
        legalRepresentative: null,
        documentsReceiver: null,
        creditApplicationDocument: null
    },
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null
});