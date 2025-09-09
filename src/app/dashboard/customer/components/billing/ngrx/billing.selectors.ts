import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BillingDataState } from '@/dashboard/customer/components/billing/ngrx/billing.state';
import { BillingData } from '@/dashboard/customer/components/billing/ngrx/billing.models';

// Feature selector
export const selectBillingDataState = createFeatureSelector<BillingDataState>('billingData');

// === DATA SELECTORS ===
export const selectBillingData = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.data
);

export const selectBillingDataOriginal = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.originalData
);

export const selectBillingDataField = (field: keyof BillingData) => createSelector(
    selectBillingData,
    (data: BillingData | null) => data ? data[field] : null
);

// === STATUS SELECTORS ===
export const selectBillingDataStatus = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.status
);

export const selectBillingDataLoading = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.loading
);

export const selectBillingDataSaving = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.saving
);

export const selectBillingDataIsBusy = createSelector(
    selectBillingDataLoading,
    selectBillingDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectBillingDataError = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectBillingDataHasUnsavedChanges = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.hasUnsavedChanges
);

export const selectBillingDataIsDirty = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.isDirty
);

export const selectBillingDataCanSave = createSelector(
    selectBillingDataLoading,
    selectBillingDataSaving,
    selectBillingDataError,
    selectBillingDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectBillingDataCanReset = createSelector(
    selectBillingDataHasUnsavedChanges,
    selectBillingDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// (Removidos selectores granulares y agrupados no utilizados para simplificar la superficie del estado)
