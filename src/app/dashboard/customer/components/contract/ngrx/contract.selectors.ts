import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContractDataState } from '@/dashboard/customer/components/contract/ngrx/contract.state';
import { ContractData } from '@/dashboard/customer/components/contract/ngrx/contract.models';

// Feature selector para el state del componente
export const selectContractDataState = createFeatureSelector<ContractDataState>('contractData');

// === DATA SELECTORS ===
export const selectContractData = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.data
);

export const selectContractDataOriginal = createSelector(
    selectContractDataState,
    (state: ContractDataState) => state.originalData
);

export const selectContractDataField = (field: keyof ContractData) => createSelector(
    selectContractData,
    (data: ContractData | null) => data ? data[field] : null
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

export const selectContractDataHasError = createSelector(
    selectContractDataError,
    (error: string | null) => !!error
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

export const selectContractDataCanReset = createSelector(
    selectContractDataHasUnsavedChanges,
    selectContractDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

export const selectContractDataIsValid = createSelector(
    selectContractData,
    (data: ContractData | null) => {
        if (!data) return false;
        // Lógica de validación básica aquí si es necesaria
        return true;
    }
);

// === FORM STATE SELECTORS ===
export const selectContractDataFormState = createSelector(
    selectContractData,
    selectContractDataLoading,
    selectContractDataSaving,
    selectContractDataError,
    selectContractDataHasUnsavedChanges,
    selectContractDataIsDirty,
    (data, loading, saving, error, hasUnsavedChanges, isDirty) => ({
        data,
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty,
        isBusy: loading || saving,
        canSave: !loading && !saving && !error && hasUnsavedChanges,
        canReset: hasUnsavedChanges && !loading && !saving
    })
);
