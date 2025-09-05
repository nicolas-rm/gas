import { ContactsData } from './contacts.models';

// Estados operacionales específicos siguiendo el estándar de general-data
export type ContactsDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario Contacts siguiendo el estándar
export interface ContactsDataState {
    // Datos del formulario
    data: ContactsData | null;
    
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
    
    // Metadatos
    lastSaved: number | null;
}

// Estado inicial
export const initialContactsDataState: ContactsDataState = {
    data: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null
};
