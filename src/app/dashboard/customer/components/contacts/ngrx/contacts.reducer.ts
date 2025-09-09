// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Estados propios
import { ContactsDataState, initialContactsDataState } from '@/dashboard/customer/components/contacts/ngrx/contacts.state';
import { ContactsPageActions, ContactsApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { ContactsData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const contactsDataAdapter: EntityAdapter<ContactsData> = createEntityAdapter<ContactsData>({
    selectId: (data: ContactsData) => data.contacts[0]?.name || 'temp-id',
    sortComparer: false,
});

export const contactsDataReducer = createReducer<ContactsDataState>(
    contactsDataAdapter.getInitialState(initialContactsDataState),

    // === LOAD DATA ===
    on(ContactsPageActions.loadData, (state: ContactsDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(ContactsApiActions.loadDataSuccess, (state: ContactsDataState, { data }) => {
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

    on(ContactsApiActions.loadDataFailure, (state: ContactsDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(ContactsPageActions.setData, (state, { data }) => {
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
    on(ContactsPageActions.saveData, (state: ContactsDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(ContactsApiActions.saveDataSuccess, (state: ContactsDataState, { data }) => {
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

    on(ContactsApiActions.saveDataFailure, (state: ContactsDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(ContactsPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = contactsDataAdapter.getInitialState(initialContactsDataState);
        const cleared = contactsDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialContactsDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as ContactsDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(ContactsPageActions.resetToOriginal, (state: ContactsDataState) => {
        const dataToRestore = state.originalData || { contacts: [] };
        const prevId = state.data ? (state.data.contacts[0]?.name || 'temp-id') : null;
        const restoreId = dataToRestore.contacts[0]?.name || 'temp-id';
        let working = state.originalData ? state : contactsDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = contactsDataAdapter.removeOne(prevId, working);
        }
        const withEntity = contactsDataAdapter.setOne(dataToRestore, working);

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

    on(ContactsPageActions.clearErrors, (state: ContactsDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(ContactsPageActions.markAsPristine, (state: ContactsDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(ContactsPageActions.markAsDirty, (state: ContactsDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = contactsDataAdapter.getSelectors();
