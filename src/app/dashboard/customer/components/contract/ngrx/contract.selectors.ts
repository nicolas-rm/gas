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

// (Se eliminó lastSaved: ya no existe en el estado estandarizado)

// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)

// (Removidos selectores granulares y agrupados no utilizados para simplificar la superficie del estado)
