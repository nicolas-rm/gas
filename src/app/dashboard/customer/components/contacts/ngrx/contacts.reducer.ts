// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Estados propios
import { ContactsDataState, initialContactsDataState } from '@/dashboard/customer/components/contacts/ngrx/contacts.state';
import { ContactsDataPageActions, ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import { ContactsData, ContactData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';

// Adapter para manejar entidades
export const contactsDataAdapter: EntityAdapter<ContactsData> = createEntityAdapter<ContactsData>({
    // Función para seleccionar el ID de la entidad
    selectId: (data) => data.contacts[0]?.name || 'contacts-data'
});

// ===== Normalización de datos de contacts =====
const toStr = (v: any) => (v == null ? '' : String(v).trim());
const isEmptyContact = (c: ContactData | null | undefined) => !c || (!toStr(c.name) && !toStr(c.position) && !toStr(c.phone) && !toStr(c.email));
const normalize = (d: ContactsData | null | undefined): ContactsData => ({
    contacts: (d?.contacts || [])
        .filter(c => !isEmptyContact(c))
        .map(c => ({
            name: c?.name ?? null,
            position: c?.position ?? null,
            phone: c?.phone ?? null,
            email: c?.email ?? null,
        }))
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
        const norm = normalize(data);
        const withEntity = contactsDataAdapter.setOne(norm, state);
        
        return {
            ...withEntity,
            data: norm,
            originalData: norm, // Guardar los datos originales al cargar
            status: 'idle' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),

    // Carga fallida: actualiza error, status "error"
    on(ContactsDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message
    })),

    // Establecer snapshot completo
    on(ContactsDataPageActions.setData, (state, { data }) => {
        const norm = normalize(data);
        const withEntity = contactsDataAdapter.setOne(norm, state);
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(norm)
            : true; // en crear: cualquier cambio = sucio

        return {
            ...state,
            ...withEntity,
            data: norm,
            hasUnsavedChanges: changed,
            isDirty: changed,
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
            originalData: data, // Actualizar datos originales después de guardar exitosamente
            status: 'saved' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
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
    on(ContactsDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = contactsDataAdapter.getInitialState(initialContactsDataState);
        const cleared = contactsDataAdapter.removeAll(base);
        return {
            ...cleared,
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
    on(ContactsDataPageActions.resetToOriginal, (state) => {
        const dataToRestore = state.originalData || { contacts: [] };
        const withEntity = contactsDataAdapter.setOne(dataToRestore, state);

        return {
            ...state,
            ...withEntity,
            data: dataToRestore,
            originalData: state.originalData,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
        };
    }),

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
