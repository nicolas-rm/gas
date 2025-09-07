// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { GeneralDataState, initialGeneralDataState } from '@/dashboard/customer/components/general-data/ngrx/general-data.state';
import { GeneralDataPageActions, GeneralDataApiActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';
import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const generalDataAdapter: EntityAdapter<GeneralData> = createEntityAdapter<GeneralData>({
    selectId: (data: GeneralData) => data.rfc || 'temp-id',
    sortComparer: false,
});

export const generalDataReducer = createReducer<GeneralDataState>(
    generalDataAdapter.getInitialState(initialGeneralDataState),

    // === LOAD DATA ===
    on(GeneralDataPageActions.loadData, (state: GeneralDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(GeneralDataApiActions.loadDataSuccess, (state: GeneralDataState, { data }) => {
        const withEntity = generalDataAdapter.setOne(data, state);

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

    on(GeneralDataApiActions.loadDataFailure, (state: GeneralDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(GeneralDataPageActions.setData, (state: GeneralDataState, { data }) => {
        const prevId = state.data ? (state.data.rfc || 'temp-id') : null;
        const newId = data.rfc || 'temp-id';
        let workingState = state;
        if (prevId && prevId !== newId) {
            workingState = generalDataAdapter.removeOne(prevId, workingState);
        }
        const withEntity = generalDataAdapter.setOne(data, workingState);
        const original = state.originalData;
        const changed = original ? JSON.stringify(original) !== JSON.stringify(data) : false;
        return {
            ...state,
            ...withEntity,
            data,
            // Si no hay datos originales, establecer estos como originales (modo crear)
            originalData: state.originalData || data,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),

    // === SAVE DATA ===
    on(GeneralDataPageActions.saveData, (state: GeneralDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(GeneralDataApiActions.saveDataSuccess, (state: GeneralDataState, { data }) => {
        const withEntity = generalDataAdapter.setOne(data, state);

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

    on(GeneralDataApiActions.saveDataFailure, (state: GeneralDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(GeneralDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = generalDataAdapter.getInitialState(initialGeneralDataState);
        const cleared = generalDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialGeneralDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as GeneralDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(GeneralDataPageActions.resetToOriginal, (state: GeneralDataState) => {
        const dataToRestore = state.originalData || {
            personType: null,
            groupType: null,
            rfc: null,
            businessName: null,
            tradeName: null,
            street: null,
            exteriorNumber: null,
            interiorNumber: null,
            crossing: null,
            country: null,
            state: null,
            colony: null,
            municipality: null,
            postalCode: null,
            phone: null,
            city: null,
            fax: null
        };
        const prevId = state.data ? (state.data.rfc || 'temp-id') : null;
        const restoreId = dataToRestore.rfc || 'temp-id';
        let working = state.originalData ? state : generalDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = generalDataAdapter.removeOne(prevId, working);
        }
        const withEntity = generalDataAdapter.setOne(dataToRestore, working);

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

    on(GeneralDataPageActions.clearErrors, (state: GeneralDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(GeneralDataPageActions.markAsPristine, (state: GeneralDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(GeneralDataPageActions.markAsDirty, (state: GeneralDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = generalDataAdapter.getSelectors();
