import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommissionDataState } from './commission.state';
import { CommissionData } from './commission.models';

// Feature selector
export const selectCommissionDataState = createFeatureSelector<CommissionDataState>('commissionData');

// === DATA SELECTORS ===
export const selectCommissionData = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.data
);

export const selectCommissionDataField = (field: keyof CommissionData) => createSelector(
    selectCommissionData,
    (data: CommissionData) => data[field]
);

// === STATUS SELECTORS ===
export const selectCommissionDataStatus = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.status
);

export const selectCommissionDataLoading = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.loading
);

export const selectCommissionDataSaving = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.saving
);

export const selectCommissionDataIsBusy = createSelector(
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectCommissionDataError = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectCommissionDataHasUnsavedChanges = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.hasUnsavedChanges
);

export const selectCommissionDataIsDirty = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.isDirty
);

export const selectCommissionDataCanSave = createSelector(
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    selectCommissionDataError,
    selectCommissionDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

// === METADATA SELECTORS ===
export const selectCommissionDataLastSaved = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.lastSaved
);

// === FORM STATE SELECTOR ===
export const selectCommissionDataFormState = createSelector(
    selectCommissionData,
    selectCommissionDataStatus,
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    selectCommissionDataError,
    selectCommissionDataHasUnsavedChanges,
    selectCommissionDataIsDirty,
    selectCommissionDataCanSave,
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

// === SPECIFIC FIELD SELECTORS ===
export const selectCommissionClassification = createSelector(
    selectCommissionData,
    (data: CommissionData) => data.commissionClassification
);

export const selectCustomerLevel = createSelector(
    selectCommissionData,
    (data: CommissionData) => data.customerLevel
);

export const selectNormalPercentage = createSelector(
    selectCommissionData,
    (data: CommissionData) => data.normalPercentage
);

export const selectEarlyPaymentPercentage = createSelector(
    selectCommissionData,
    (data: CommissionData) => data.earlyPaymentPercentage
);

export const selectIncomeAccountingAccount = createSelector(
    selectCommissionData,
    (data: CommissionData) => data.incomeAccountingAccount
);
