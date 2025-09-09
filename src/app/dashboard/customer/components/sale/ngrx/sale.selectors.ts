import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SaleDataState } from '@/dashboard/customer/components/sale/ngrx/sale.state';
import { SaleData } from '@/dashboard/customer/components/sale/ngrx/sale.models';

// Feature selector para el state del componente
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

export const selectSaleDataHasError = createSelector(
    selectSaleDataError,
    (error: string | null) => !!error
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

export const selectSaleDataIsValid = createSelector(
    selectSaleData,
    (data: SaleData | null) => {
        if (!data) return false;
        // Lógica de validación básica aquí si es necesaria
        return true;
    }
);

// === FORM STATE SELECTORS ===
export const selectSaleDataFormState = createSelector(
    selectSaleData,
    selectSaleDataLoading,
    selectSaleDataSaving,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    selectSaleDataIsDirty,
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
