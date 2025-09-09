// NgRx
import { EntityState } from '@ngrx/entity';

import { ContractData } from '@/dashboard/customer/components/contract/ngrx/contract.models';

export type ContractDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface ContractDataState extends EntityState<ContractData> {
    // Datos del formulario
    data: ContractData | null;
    
    // Datos originales para restablecer
    originalData: ContractData | null;

    // Estado de la operación
    status: ContractDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialContractDataState: ContractDataState = {
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
