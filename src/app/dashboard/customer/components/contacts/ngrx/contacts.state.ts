// NgRx
import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContactsData } from './contacts.models';

// EntityAdapter para manejo eficiente del estado
export const contactsDataAdapter = createEntityAdapter<ContactsData>({
    selectId: (data: ContactsData) => 'contacts', // Solo un registro
    sortComparer: false
});

// Estados operacionales específicos siguiendo el estándar de general-data
export type ContactsDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario Contacts siguiendo el estándar y EntityState
export interface ContactsDataState extends EntityState<ContactsData> {
    // Datos del formulario
    data: ContactsData | null;
    
    // Datos originales para restablecer
    originalData: ContactsData | null;
    
    // Estados operacionales
    status: ContactsDataStatus;
    
    // Estados de carga y guardado
    loading: boolean;
    saving: boolean;
    
    // Manejo de errores
    error: string | null;
    
    // Control de cambios
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

// Estado inicial usando EntityAdapter
export const initialContactsDataState: ContactsDataState = contactsDataAdapter.getInitialState({
    // Propiedades customizadas
    data: null,
    originalData: null,
    status: 'idle' as ContactsDataStatus,
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false
});
