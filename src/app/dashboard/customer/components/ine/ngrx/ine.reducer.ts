// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IneDataState, initialIneDataState } from '@/dashboard/customer/components/ine/ngrx/ine.state';
import { IneDataPageActions, IneDataApiActions } from '@/dashboard/customer/components/ine/ngrx/ine.actions';
import { IneData } from '@/dashboard/customer/components/ine/ngrx/ine.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const ineDataAdapter: EntityAdapter<IneData> = createEntityAdapter<IneData>({
    selectId: () => 'ine', // Solo hay un registro de INE por customer
    sortComparer: false,
});

export const ineDataReducer = createReducer<IneDataState>(
    ineDataAdapter.getInitialState(initialIneDataState),

    // === LOAD DATA ===
    on(IneDataPageActions.loadData, (state: IneDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(IneDataApiActions.loadDataSuccess, (state: IneDataState, { data }) => {
        const withEntity = ineDataAdapter.setOne(data, state);

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

    on(IneDataApiActions.loadDataFailure, (state: IneDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(IneDataPageActions.setData, (state, { data }) => {
        const withEntity = ineDataAdapter.setOne(data, state);
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
    on(IneDataPageActions.saveData, (state: IneDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(IneDataApiActions.saveDataSuccess, (state: IneDataState, { data }) => {
        const withEntity = ineDataAdapter.setOne(data, state);

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

    on(IneDataApiActions.saveDataFailure, (state: IneDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(IneDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = ineDataAdapter.getInitialState(initialIneDataState);
        const cleared = ineDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialIneDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as IneDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(IneDataPageActions.resetToOriginal, (state: IneDataState) => {
        const dataToRestore = state.originalData || {
            accountingKey: null,
            processType: null,
            committeeType: null,
            scope: null,
            document: null
        };
        const prevId = 'ine';
        const restoreId = 'ine';
        let working = state.originalData ? state : ineDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = ineDataAdapter.removeOne(prevId, working);
        }
        const withEntity = ineDataAdapter.setOne(dataToRestore, working);

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

    on(IneDataPageActions.clearErrors, (state: IneDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(IneDataPageActions.markAsPristine, (state: IneDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(IneDataPageActions.markAsDirty, (state: IneDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = ineDataAdapter.getSelectors();
