import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SaleDataState } from './sale.state';
import { SaleData } from './sale.models';

// Feature selector
export const selectSaleDataState = createFeatureSelector<SaleDataState>('saleData');

// === DATA SELECTORS ===
export const selectSaleData = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.data
);

export const selectSaleDataField = (field: keyof SaleData) => createSelector(
    selectSaleData,
    (data: SaleData) => data[field]
);

// === STATUS SELECTORS ===
export const selectSaleDataStatus = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.status
);

export const selectSaleDataLoading = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.loading
);

export const selectSaleDataSaving = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.saving
);

export const selectSaleDataIsBusy = createSelector(
    selectSaleDataLoading,
    selectSaleDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectSaleDataError = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectSaleDataHasUnsavedChanges = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.hasUnsavedChanges
);

export const selectSaleDataIsDirty = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.isDirty
);

export const selectSaleDataLastSaved = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.lastSaved
);

export const selectSaleDataCanSave = createSelector(
    selectSaleDataHasUnsavedChanges,
    selectSaleDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

// === COMBINED SELECTORS ===
export const selectSaleDataFormState = createSelector(
    selectSaleData,
    selectSaleDataStatus,
    selectSaleDataLoading,
    selectSaleDataSaving,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    selectSaleDataIsDirty,
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
export const selectAccountType = createSelector(
    selectSaleData,
    (data: SaleData) => data.accountType
);

export const selectSeller = createSelector(
    selectSaleData,
    (data: SaleData) => data.seller
);

export const selectAccountNumber = createSelector(
    selectSaleData,
    (data: SaleData) => data.accountNumber
);

export const selectPrepaidType = createSelector(
    selectSaleData,
    (data: SaleData) => data.prepaidType
);

export const selectPaymentMethod = createSelector(
    selectSaleData,
    (data: SaleData) => data.paymentMethod
);

// === GROUPED SELECTORS ===
export const selectSaleDataCredit = createSelector(
    selectSaleData,
    (data: SaleData) => ({
        creditDays: data.creditDays,
        creditLimit: data.creditLimit,
        advanceCommission: data.advanceCommission
    })
);

export const selectSaleDataAccount = createSelector(
    selectSaleData,
    (data: SaleData) => ({
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        prepaidType: data.prepaidType
    })
);