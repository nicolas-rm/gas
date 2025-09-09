// NgRx
import { EntityState } from '@ngrx/entity';

import { BillingData } from '@/dashboard/customer/components/billing/ngrx/billing.models';

export type BillingDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface BillingDataState extends EntityState<BillingData> {
    // Datos del formulario
    data: BillingData | null;
    
    // Datos originales para restablecer
    originalData: BillingData | null;

    // Estado de la operación
    status: BillingDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialBillingDataState: BillingDataState = {
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
