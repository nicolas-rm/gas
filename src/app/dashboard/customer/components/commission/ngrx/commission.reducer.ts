// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CommissionDataState, initialCommissionDataState } from '@/dashboard/customer/components/commission/ngrx/commission.state';
import { CommissionDataPageActions, CommissionDataApiActions } from '@/dashboard/customer/components/commission/ngrx/commission.actions';
import { CommissionData } from '@/dashboard/customer/components/commission/ngrx/commission.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const commissionDataAdapter: EntityAdapter<CommissionData> = createEntityAdapter<CommissionData>({
    selectId: (data: CommissionData) => data.commissionClassification || 'temp-id',
    sortComparer: false,
});

export const commissionDataReducer = createReducer<CommissionDataState>(
    commissionDataAdapter.getInitialState(initialCommissionDataState),

    // === LOAD DATA ===
    on(CommissionDataPageActions.loadData, (state: CommissionDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(CommissionDataApiActions.loadDataSuccess, (state: CommissionDataState, { data }) => {
        const withEntity = commissionDataAdapter.setOne(data, state);

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

    on(CommissionDataApiActions.loadDataFailure, (state: CommissionDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(CommissionDataPageActions.setData, (state, { data }) => {
        const withEntity = commissionDataAdapter.setOne(data, state);
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
    on(CommissionDataPageActions.saveData, (state: CommissionDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(CommissionDataApiActions.saveDataSuccess, (state: CommissionDataState, { data }) => {
        const withEntity = commissionDataAdapter.setOne(data, state);

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

    on(CommissionDataApiActions.saveDataFailure, (state: CommissionDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(CommissionDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = commissionDataAdapter.getInitialState(initialCommissionDataState);
        const cleared = commissionDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialCommissionDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as CommissionDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(CommissionDataPageActions.resetToOriginal, (state: CommissionDataState) => {
        const dataToRestore = state.originalData || {
            commissionClassification: null,
            customerLevel: null,
            normalPercentage: null,
            earlyPaymentPercentage: null,
            incomeAccountingAccount: null
        };
        const prevId = state.data ? (state.data.commissionClassification || 'temp-id') : null;
        const restoreId = dataToRestore.commissionClassification || 'temp-id';
        let working = state.originalData ? state : commissionDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = commissionDataAdapter.removeOne(prevId, working);
        }
        const withEntity = commissionDataAdapter.setOne(dataToRestore, working);

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

    on(CommissionDataPageActions.clearErrors, (state: CommissionDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(CommissionDataPageActions.markAsPristine, (state: CommissionDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(CommissionDataPageActions.markAsDirty, (state: CommissionDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = commissionDataAdapter.getSelectors();
