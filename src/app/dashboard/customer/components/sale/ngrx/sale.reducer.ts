// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { SaleDataState, initialSaleDataState } from '@/dashboard/customer/components/sale/ngrx/sale.state';
import { SaleDataPageActions, SaleDataApiActions } from '@/dashboard/customer/components/sale/ngrx/sale.actions';
import { SaleData } from '@/dashboard/customer/components/sale/ngrx/sale.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const saleDataAdapter: EntityAdapter<SaleData> = createEntityAdapter<SaleData>({
    selectId: (data: SaleData) => data.accountNumber || 'temp-id',
    sortComparer: false,
});

export const saleDataReducer = createReducer<SaleDataState>(
    saleDataAdapter.getInitialState(initialSaleDataState),

    // === LOAD DATA ===
    on(SaleDataPageActions.loadData, (state: SaleDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(SaleDataApiActions.loadDataSuccess, (state: SaleDataState, { data }) => {
        const withEntity = saleDataAdapter.setOne(data, state);

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

    on(SaleDataApiActions.loadDataFailure, (state: SaleDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(SaleDataPageActions.setData, (state, { data }) => {
        const withEntity = saleDataAdapter.setOne(data, state);
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
    on(SaleDataPageActions.saveData, (state: SaleDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(SaleDataApiActions.saveDataSuccess, (state: SaleDataState, { data }) => {
        const withEntity = saleDataAdapter.setOne(data, state);

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

    on(SaleDataApiActions.saveDataFailure, (state: SaleDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(SaleDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = saleDataAdapter.getInitialState(initialSaleDataState);
        const cleared = saleDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialSaleDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as SaleDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(SaleDataPageActions.resetToOriginal, (state: SaleDataState) => {
        const dataToRestore = state.originalData || {
            accountType: null,
            seller: null,
            accountNumber: null,
            prepaidType: null,
            creditDays: null,
            creditLimit: null,
            advanceCommission: null,
            paymentMethod: null,
            voucherAmount: null
        };
        const prevId = state.data ? (state.data.accountNumber || 'temp-id') : null;
        const restoreId = dataToRestore.accountNumber || 'temp-id';
        let working = state.originalData ? state : saleDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = saleDataAdapter.removeOne(prevId, working);
        }
        const withEntity = saleDataAdapter.setOne(dataToRestore, working);

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

    on(SaleDataPageActions.clearErrors, (state: SaleDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(SaleDataPageActions.markAsPristine, (state: SaleDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(SaleDataPageActions.markAsDirty, (state: SaleDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = saleDataAdapter.getSelectors();
