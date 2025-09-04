// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ContractDataState, initialContractDataState } from './contract.state';
import { ContractDataPageActions, ContractDataApiActions } from './contract.actions';
import { ContractData } from './contract.models';

// Entity Adapter
export const contractDataAdapter: EntityAdapter<ContractData> = createEntityAdapter<ContractData>({
    selectId: (data: ContractData) => data.printName || 'temp-id',
    sortComparer: false,
});

export const contractDataReducer = createReducer(
    initialContractDataState,

    // === LOAD DATA ===
    on(ContractDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(ContractDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(ContractDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(ContractDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        data: {
            ...state.data,
            [field]: value,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(ContractDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(ContractDataPageActions.setData, (state, { data }) => ({
        ...state,
        data,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    // === SAVE DATA ===
    on(ContractDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(ContractDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(ContractDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET & CLEANUP ===
    on(ContractDataPageActions.resetForm, () => initialContractDataState),

    on(ContractDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(ContractDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(ContractDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
