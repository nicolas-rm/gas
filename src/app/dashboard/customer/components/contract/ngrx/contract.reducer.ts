// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ContractDataState, initialContractDataState } from '@/dashboard/customer/components/contract/ngrx/contract.state';
import { ContractDataPageActions, ContractDataApiActions } from '@/dashboard/customer/components/contract/ngrx/contract.actions';
import { ContractData } from '@/dashboard/customer/components/contract/ngrx/contract.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const contractDataAdapter: EntityAdapter<ContractData> = createEntityAdapter<ContractData>({
    selectId: (data: ContractData) => data.printName || 'temp-id',
    sortComparer: false,
});

export const contractDataReducer = createReducer<ContractDataState>(
    contractDataAdapter.getInitialState(initialContractDataState),

    // === LOAD DATA ===
    on(ContractDataPageActions.loadData, (state: ContractDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(ContractDataApiActions.loadDataSuccess, (state: ContractDataState, { data }) => {
        const withEntity = contractDataAdapter.setOne(data, state);

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

    on(ContractDataApiActions.loadDataFailure, (state: ContractDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(ContractDataPageActions.setData, (state, { data }) => {
        const withEntity = contractDataAdapter.setOne(data, state);
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
    on(ContractDataPageActions.saveData, (state: ContractDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(ContractDataApiActions.saveDataSuccess, (state: ContractDataState, { data }) => {
        const withEntity = contractDataAdapter.setOne(data, state);

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

    on(ContractDataApiActions.saveDataFailure, (state: ContractDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(ContractDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = contractDataAdapter.getInitialState(initialContractDataState);
        const cleared = contractDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialContractDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as ContractDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(ContractDataPageActions.resetToOriginal, (state: ContractDataState) => {
        const dataToRestore = state.originalData || {
            printName: null,
            adminFee: null,
            cardIssueFee: null,
            reportsFee: null,
            accountingAccount: null,
            cfdiUsage: null,
            type: null,
            loyalty: null,
            percentage: null,
            rfcOrderingAccount: null,
            bank: null
        };
        const prevId = state.data ? (state.data.printName || 'temp-id') : null;
        const restoreId = dataToRestore.printName || 'temp-id';
        let working = state.originalData ? state : contractDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = contractDataAdapter.removeOne(prevId, working);
        }
        const withEntity = contractDataAdapter.setOne(dataToRestore, working);

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

    on(ContractDataPageActions.clearErrors, (state: ContractDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(ContractDataPageActions.markAsPristine, (state: ContractDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(ContractDataPageActions.markAsDirty, (state: ContractDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = contractDataAdapter.getSelectors();
