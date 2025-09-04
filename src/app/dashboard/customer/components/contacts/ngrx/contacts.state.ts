import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ContactsData } from './contacts.models';

// Estados operacionales específicos siguiendo el estándar de general-data
export type ContactsDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Estado principal del formulario Contacts siguiendo el estándar
export interface ContactsDataState extends EntityState<ContactsData> {
    // Datos del formulario
    data: ContactsData;
    
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
    lastSaved: string | null;
}

// Entity Adapter
export const contactsDataAdapter: EntityAdapter<ContactsData> = createEntityAdapter<ContactsData>({
    selectId: () => 'contacts' // Solo hay un registro de contactos por customer
});

// Estado inicial
export const initialContactsDataState: ContactsDataState = contactsDataAdapter.getInitialState({
    data: {
        contacts: []
    },
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null
});