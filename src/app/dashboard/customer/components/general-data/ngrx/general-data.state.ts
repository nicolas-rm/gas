// NgRx
import { EntityState } from '@ngrx/entity';

import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';

export type GeneralDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface GeneralDataState extends EntityState<GeneralData> {
    // Datos del formulario
    data: GeneralData | null;

    // Estado de la operación
    status: GeneralDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    lastSaved: number | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialGeneralDataState: GeneralDataState = {
    // Propiedades del EntityState
    ids: [],
    entities: {},
    
    // Propiedades customizadas
    data: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    isDirty: false
};
