import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CreditRequestDataState } from './credit-request.state';
import { CreditRequestData } from './credit-request.models';

// Feature selector
export const selectCreditRequestDataState = createFeatureSelector<CreditRequestDataState>('creditRequestData');

// === DATA SELECTORS ===
export const selectCreditRequestData = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.data
);

export const selectCreditRequestDataOriginal = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.originalData
);

export const selectCreditRequestDataField = (field: keyof CreditRequestData) => createSelector(
    selectCreditRequestData,
    (data: CreditRequestData | null) => data ? data[field] : null
);

// === STATUS SELECTORS ===
export const selectCreditRequestDataStatus = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.status
);

export const selectCreditRequestDataLoading = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.loading
);

export const selectCreditRequestDataSaving = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.saving
);

export const selectCreditRequestDataIsBusy = createSelector(
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectCreditRequestDataError = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectCreditRequestDataHasUnsavedChanges = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.hasUnsavedChanges
);

export const selectCreditRequestDataIsDirty = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.isDirty
);

export const selectCreditRequestDataCanSave = createSelector(
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    selectCreditRequestDataError,
    selectCreditRequestDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectCreditRequestDataCanReset = createSelector(
    selectCreditRequestDataHasUnsavedChanges,
    selectCreditRequestDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// === FORM STATE SELECTOR ===
// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)
