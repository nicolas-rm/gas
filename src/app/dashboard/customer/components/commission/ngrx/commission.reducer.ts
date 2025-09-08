// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { CommissionDataState, initialCommissionDataState } from './commission.state';
import { CommissionDataPageActions, CommissionDataApiActions } from './commission.actions';
import { CommissionData } from './commission.models';

// Entity Adapter
export const commissionDataAdapter: EntityAdapter<CommissionData> = createEntityAdapter<CommissionData>({
    selectId: (data: CommissionData) => data.commissionClassification || 'temp-id',
    sortComparer: false,
});

export const commissionDataReducer = createReducer(
    initialCommissionDataState,

    // === LOAD DATA ===
    on(CommissionDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(CommissionDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Guardar datos originales al cargar
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(CommissionDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(CommissionDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        data: {
            ...state.data,
            [field]: value,
        },
    })),

    on(CommissionDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
    })),

    on(CommissionDataPageActions.setData, (state, { data }) => {
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true;
        return {
            ...state,
            data,
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),

    // === SAVE DATA ===
    on(CommissionDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(CommissionDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Actualizar datos originales después de guardar exitosamente
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(CommissionDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET & CLEANUP ===
    // Resetear formulario completamente (volver al estado inicial)
    on(CommissionDataPageActions.resetForm, () => initialCommissionDataState),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(CommissionDataPageActions.resetToOriginal, (state) => {
        const dataToRestore = state.originalData || {
            commissionClassification: null,
            customerLevel: null,
            normalPercentage: null,
            earlyPaymentPercentage: null,
            incomeAccountingAccount: null
        };
        
        return {
            ...state,
            data: dataToRestore,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),

    on(CommissionDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(CommissionDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(CommissionDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
