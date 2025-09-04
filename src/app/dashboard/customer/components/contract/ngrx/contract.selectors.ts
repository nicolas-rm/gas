import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContractDataState } from './contract.state';
import { ContractData } from './contract.models';

// Feature selector
export const selectContractDataState = createFeatureSelector<ContractDataState>('contractData');

// === DATA SELECTORS ===
export const selectContractData = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.data
);

export const selectContractDataField = (field: keyof ContractData) => createSelector(
    selectContractData,
    (data: ContractData) => data[field]
);

// === STATUS SELECTORS ===
export const selectContractDataStatus = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.status
);

export const selectContractDataLoading = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.loading
);

export const selectContractDataSaving = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.saving
);

export const selectContractDataIsBusy = createSelector(
    selectContractDataLoading,
    selectContractDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectContractDataError = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectContractDataHasUnsavedChanges = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.hasUnsavedChanges
);

export const selectContractDataIsDirty = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.isDirty
);

export const selectContractDataCanSave = createSelector(
    selectContractDataLoading,
    selectContractDataSaving,
    selectContractDataError,
    selectContractDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

// === METADATA SELECTORS ===
export const selectContractDataLastSaved = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.lastSaved
);

// === FORM STATE SELECTOR ===
export const selectContractDataFormState = createSelector(
    selectContractData,
    selectContractDataStatus,
    selectContractDataLoading,
    selectContractDataSaving,
    selectContractDataError,
    selectContractDataHasUnsavedChanges,
    selectContractDataIsDirty,
    selectContractDataCanSave,
    (data, status, loading, saving, error, hasUnsavedChanges, isDirty, canSave) => ({
        data,
        status,
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty,
        canSave,
        isBusy: loading || saving
    })
);
