// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { BillingDataState, initialBillingDataState } from '@/dashboard/customer/components/billing/ngrx/billing.state';
import { BillingDataPageActions, BillingDataApiActions } from '@/dashboard/customer/components/billing/ngrx/billing.actions';
import { BillingData } from '@/dashboard/customer/components/billing/ngrx/billing.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const billingDataAdapter: EntityAdapter<BillingData> = createEntityAdapter<BillingData>({
    selectId: (data: BillingData) => data.billingEmails || 'temp-id',
    sortComparer: false,
});

export const billingDataReducer = createReducer<BillingDataState>(
    billingDataAdapter.getInitialState(initialBillingDataState),

    // === LOAD DATA ===
    on(BillingDataPageActions.loadData, (state: BillingDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(BillingDataApiActions.loadDataSuccess, (state: BillingDataState, { data }) => {
        const withEntity = billingDataAdapter.setOne(data, state);

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

    on(BillingDataApiActions.loadDataFailure, (state: BillingDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // (Eliminadas acciones granulares updateField / updateMultipleFields)
    on(BillingDataPageActions.setData, (state, { data }) => {
        const withEntity = billingDataAdapter.setOne(data, state);
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
    on(BillingDataPageActions.saveData, (state: BillingDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(BillingDataApiActions.saveDataSuccess, (state: BillingDataState, { data }) => {
        const withEntity = billingDataAdapter.setOne(data, state);

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

    on(BillingDataApiActions.saveDataFailure, (state: BillingDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(BillingDataPageActions.resetForm, () => {
        // Limpia completamente el adapter y restablece el estado extendido
        const base = billingDataAdapter.getInitialState(initialBillingDataState);
        const cleared = billingDataAdapter.removeAll(base);
        return {
            ...cleared,
            // Las props custom ya están en initialBillingDataState
            error: null,
            data: null,
            originalData: null,
            status: 'idle',
            loading: false,
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false
        } as BillingDataState;
    }),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(BillingDataPageActions.resetToOriginal, (state: BillingDataState) => {
        const dataToRestore = state.originalData || {
            invoiceRepresentation: null,
            billingDays: null,
            billingEmails: null,
            billingFrequency: null,
            startDate: null,
            endDate: null,
            automaticBilling: null
        };
        const prevId = state.data ? (state.data.billingEmails || 'temp-id') : null;
        const restoreId = dataToRestore.billingEmails || 'temp-id';
        let working = state.originalData ? state : billingDataAdapter.removeAll(state);
        if (prevId && prevId !== restoreId) {
            working = billingDataAdapter.removeOne(prevId, working);
        }
        const withEntity = billingDataAdapter.setOne(dataToRestore, working);

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

    on(BillingDataPageActions.clearErrors, (state: BillingDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(BillingDataPageActions.markAsPristine, (state: BillingDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(BillingDataPageActions.markAsDirty, (state: BillingDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = billingDataAdapter.getSelectors();
