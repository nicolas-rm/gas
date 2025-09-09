// NgRx
import { createReducer, on } from '@ngrx/store';

// Estados propios
import { ContactsDataState, initialContactsDataState, contactsDataAdapter } from '@/dashboard/customer/components/contacts/ngrx/contacts.state';
import { ContactsDataPageActions, ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { ContactsData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';

export const contactsDataReducer = createReducer<ContactsDataState>(
    initialContactsDataState,

    // === LOAD DATA ===
    on(ContactsDataPageActions.loadData, (state: ContactsDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(ContactsDataApiActions.loadDataSuccess, (state: ContactsDataState, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);

        return {
            ...state,
            ...withEntity,
            data,
            originalData: data, // Guardar los datos originales al cargar
            status: 'idle' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
        };
    }),

    on(ContactsDataApiActions.loadDataFailure, (state: ContactsDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === SET DATA (Snapshot completo) ===
    on(ContactsDataPageActions.setData, (state, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true; // en crear: cualquier cambio = sucio

        return {
            ...state,
            ...withEntity,
            data,
            // NO tocar originalData aquí
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),

    // === SAVE DATA ===
    on(ContactsDataPageActions.saveData, (state: ContactsDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(ContactsDataApiActions.saveDataSuccess, (state: ContactsDataState, { data }) => {
        const withEntity = contactsDataAdapter.setOne(data, state);

        return {
            ...state,
            ...withEntity,
            data,
            originalData: data, // Actualizar datos originales después de guardar exitosamente
            status: 'saved' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
        };
    }),

    on(ContactsDataApiActions.saveDataFailure, (state: ContactsDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(ContactsDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        return {
            ...initialContactsDataState,
            error: null,
            data: null,
            originalData: null,
            status: 'idle' as const,
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(ContactsDataPageActions.resetToOriginal, (state: ContactsDataState) => {
        const dataToRestore = state.originalData || { contacts: [] };
        const withEntity = contactsDataAdapter.setOne(dataToRestore, state);

        return {
            ...state,
            ...withEntity,
            data: dataToRestore,
            originalData: state.originalData,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
        };
    }),

    on(ContactsDataPageActions.clearErrors, (state: ContactsDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(ContactsDataPageActions.markAsPristine, (state: ContactsDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(ContactsDataPageActions.markAsDirty, (state: ContactsDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = contactsDataAdapter.getSelectors();
