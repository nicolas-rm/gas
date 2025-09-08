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

export const selectSaleDataOriginal = createSelector(
    selectSaleDataState,
    (state: SaleDataState) => state.originalData
);

export const selectSaleDataField = (field: keyof SaleData) => createSelector(
    selectSaleData,
    (data: SaleData | null) => data ? data[field] : null
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


export const selectSaleDataCanSave = createSelector(
    selectSaleDataLoading,
    selectSaleDataSaving,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectSaleDataCanReset = createSelector(
    selectSaleDataHasUnsavedChanges,
    selectSaleDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// === FORM STATE SELECTOR ===
export const selectSaleDataFormState = createSelector(
    selectSaleData,
    selectSaleDataStatus,
    selectSaleDataLoading,
    selectSaleDataSaving,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    selectSaleDataIsDirty,
    selectSaleDataCanSave,
    selectSaleDataCanReset,
    (data, status, loading, saving, error, hasUnsavedChanges, isDirty, canSave, canReset) => ({
        data,
        status,
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty,
        canSave,
        canReset,
        isBusy: loading || saving
    })
);

// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)
