// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Estados propios
import { ContactsDataState, initialContactsDataState } from '@/dashboard/customer/components/contacts/ngrx/contacts.state';
import { ContactsDataPageActions, ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { ContactsData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';

// Adapter para manejar entidades
export const contactsDataAdapter: EntityAdapter<ContactsData> = createEntityAdapter<ContactsData>({
    // Función para seleccionar el ID de la entidad
    selectId: (data) => data.contacts[0]?.name || 'contacts-data'
});

// Estado inicial del slice de contacts
export const initialState: ContactsDataState = contactsDataAdapter.getInitialState(initialContactsDataState);

// Reducer principal para contacts data
export const contactsDataReducer = createReducer(
    initialState,

    // === LOAD DATA ===
    // Iniciar carga (loading=true, resetea error)
    on(ContactsDataPageActions.loadData, state => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null
    })),

    // Carga exitosa: guarda datos, actualiza status, resetea flags
    on(ContactsDataApiActions.loadDataSuccess, (state, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: 'idle' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: Date.now()
        };
    }),

    // Carga fallida: actualiza error, status "error"
    on(ContactsDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message
    })),

    // === UPDATE FIELDS ===
    // Actualizar campo específico
    on(ContactsDataPageActions.updateField, (state, { field, value }) => {
        const currentData = state.data || { contacts: [] };
        // Para contacts, el único field válido es 'contacts' que es un array
        if (field === 'contacts' && Array.isArray(value)) {
            const updatedData = {
                ...currentData,
                contacts: value
            };
            const withEntity = contactsDataAdapter.setOne(updatedData, state);
            
            return {
                ...withEntity,
                data: updatedData,
                status: state.status,
                loading: state.loading,
                saving: state.saving,
                error: state.error,
                hasUnsavedChanges: true,
                isDirty: true,
                lastSaved: state.lastSaved
            };
        }
        return state;
    }),

    // Actualizar múltiples campos
    on(ContactsDataPageActions.updateMultipleFields, (state, { updates }) => {
        const currentData = state.data || { contacts: [] };
        const updatedData = {
            ...currentData,
            ...updates
        };
        const withEntity = contactsDataAdapter.setOne(updatedData, state);
        
        return {
            ...withEntity,
            data: updatedData,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: true,
            isDirty: true,
            lastSaved: state.lastSaved
        };
    }),

    // Establecer datos completos
    on(ContactsDataPageActions.setData, (state, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: state.lastSaved
        };
    }),

    // === SAVE DATA ===
    // Iniciar guardado (saving=true, resetea error)
    on(ContactsDataPageActions.saveData, state => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),

    // Guardado exitoso: actualiza datos, status "saved"
    on(ContactsDataApiActions.saveDataSuccess, (state, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: 'saved' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: Date.now()
        };
    }),

    // Guardado fallido: actualiza error, status "error"
    on(ContactsDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario (limpia todo el estado)
    on(ContactsDataPageActions.resetForm, () => ({
        ...initialState
    })),

    // Limpiar errores
    on(ContactsDataPageActions.clearErrors, state => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    // Marcar como pristine
    on(ContactsDataPageActions.markAsPristine, state => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false
    })),

    // Marcar como dirty
    on(ContactsDataPageActions.markAsDirty, state => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = contactsDataAdapter.getSelectors();
