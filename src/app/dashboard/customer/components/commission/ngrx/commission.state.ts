// NgRx
import { EntityState } from '@ngrx/entity';

import { CommissionData } from '@/dashboard/customer/components/commission/ngrx/commission.models';

export type CommissionDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface CommissionDataState extends EntityState<CommissionData> {
    // Datos del formulario
    data: CommissionData | null;
    
    // Datos originales para restablecer
    originalData: CommissionData | null;

    // Estado de la operación
    status: CommissionDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialCommissionDataState: CommissionDataState = {
    // Propiedades del EntityState
    ids: [],
    entities: {},
    
    // Propiedades customizadas
    data: null,
    originalData: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false
};
