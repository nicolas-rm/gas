import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SaleData } from '@/dashboard/customer/components/sale/ngrx/sale.models';

// Estados operacionales específicos siguiendo el estándar de general-data
export type SaleDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario Sale siguiendo el estándar
export interface SaleDataState extends EntityState<SaleData> {
    // Datos del formulario
    data: SaleData | null;
    
    // Datos originales para restablecer
    originalData: SaleData | null;
    
    // Estados operacionales
    status: SaleDataStatus;
    
    // Estados de carga y guardado
    loading: boolean;
    saving: boolean;
    
    // Manejo de errores
    error: string | null;
    
    // Control de cambios
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

// Entity Adapter
export const saleDataAdapter: EntityAdapter<SaleData> = createEntityAdapter<SaleData>({
    selectId: (data: SaleData) => data.accountNumber || 'temp-id',
    sortComparer: false,
});

// Estado inicial
export const initialSaleDataState: SaleDataState = saleDataAdapter.getInitialState({
    data: null,
    originalData: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false
});
