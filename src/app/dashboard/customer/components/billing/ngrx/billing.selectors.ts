import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BillingDataState } from './billing.state';
import { BillingData } from './billing.models';

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
    (data: BillingData) => data[field]
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

export const selectBillingDataLastSaved = createSelector(
    selectBillingDataState,
    (state: BillingDataState) => state.lastSaved
);

export const selectBillingDataCanSave = createSelector(
    selectBillingDataHasUnsavedChanges,
    selectBillingDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

export const selectBillingDataCanReset = createSelector(
    selectBillingDataHasUnsavedChanges,
    selectBillingDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// === COMBINED SELECTORS ===
export const selectBillingDataFormState = createSelector(
    selectBillingData,
    selectBillingDataStatus,
    selectBillingDataLoading,
    selectBillingDataSaving,
    selectBillingDataError,
    selectBillingDataHasUnsavedChanges,
    selectBillingDataIsDirty,
    (
        data,
        status,
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty
    ) => ({
        data,
        status,
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty,
        canSave: hasUnsavedChanges && !saving,
        isBusy: loading || saving
    })
);

// === SPECIFIC FIELD SELECTORS ===
export const selectInvoiceRepresentation = createSelector(
    selectBillingData,
    (data: BillingData) => data.invoiceRepresentation
);

export const selectBillingDays = createSelector(
    selectBillingData,
    (data: BillingData) => data.billingDays
);

export const selectBillingEmails = createSelector(
    selectBillingData,
    (data: BillingData) => data.billingEmails
);

export const selectBillingFrequency = createSelector(
    selectBillingData,
    (data: BillingData) => data.billingFrequency
);

export const selectAutomaticBilling = createSelector(
    selectBillingData,
    (data: BillingData) => data.automaticBilling
);

// === GROUPED SELECTORS ===
export const selectBillingDataDates = createSelector(
    selectBillingData,
    (data: BillingData) => ({
        startDate: data.startDate,
        endDate: data.endDate
    })
);

export const selectBillingDataConfiguration = createSelector(
    selectBillingData,
    (data: BillingData) => ({
        invoiceRepresentation: data.invoiceRepresentation,
        billingFrequency: data.billingFrequency,
        automaticBilling: data.automaticBilling
    })
);
