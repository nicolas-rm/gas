import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IneData } from './ine.models';

// Estados operacionales específicos siguiendo el estándar de general-data
export type IneDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario INE siguiendo el estándar
export interface IneDataState extends EntityState<IneData> {
    // Datos del formulario
    data: IneData | null;
    
    // Estados operacionales
    status: IneDataStatus;
    
    // Estados de carga y guardado
    loading: boolean;
    saving: boolean;
    
    // Manejo de errores
    error: string | null;
    
    // Control de cambios
    hasUnsavedChanges: boolean;
    isDirty: boolean;
    
    // Metadatos
    lastSaved: number | null;
}

// Entity Adapter
export const ineDataAdapter: EntityAdapter<IneData> = createEntityAdapter<IneData>({
    selectId: () => 'ine' // Solo hay un registro de INE por customer
});

// Estado inicial
export const initialIneDataState: IneDataState = ineDataAdapter.getInitialState({
    data: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null
});
