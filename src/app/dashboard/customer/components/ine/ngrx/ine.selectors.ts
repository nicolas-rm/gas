import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IneDataState } from '@/dashboard/customer/components/ine/ngrx/ine.state';
import { IneData } from '@/dashboard/customer/components/ine/ngrx/ine.models';

// Feature selector para el state del componente
export const selectIneDataState = createFeatureSelector<IneDataState>('ineData');

// === DATA SELECTORS ===
export const selectIneData = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.data
);

export const selectIneDataOriginal = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.originalData
);

export const selectIneDataField = (field: keyof IneData) => createSelector(
    selectIneData,
    (data: IneData | null) => data ? data[field] : null
);

// === STATUS SELECTORS ===
export const selectIneDataStatus = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.status
);

export const selectIneDataLoading = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.loading
);

export const selectIneDataSaving = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.saving
);

export const selectIneDataIsBusy = createSelector(
    selectIneDataLoading,
    selectIneDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectIneDataError = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.error
);

export const selectIneDataHasError = createSelector(
    selectIneDataError,
    (error: string | null) => !!error
);

// === CHANGE TRACKING SELECTORS ===
export const selectIneDataHasUnsavedChanges = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.hasUnsavedChanges
);

export const selectIneDataIsDirty = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.isDirty
);

export const selectIneDataCanSave = createSelector(
    selectIneDataLoading,
    selectIneDataSaving,
    selectIneDataError,
    selectIneDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectIneDataCanReset = createSelector(
    selectIneDataHasUnsavedChanges,
    selectIneDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

export const selectIneDataIsValid = createSelector(
    selectIneData,
    (data: IneData | null) => {
        if (!data) return false;
        // Lógica de validación básica aquí si es necesaria
        return true;
    }
);

// === FORM STATE SELECTORS ===
export const selectIneDataFormState = createSelector(
    selectIneData,
    selectIneDataLoading,
    selectIneDataSaving,
    selectIneDataError,
    selectIneDataHasUnsavedChanges,
    selectIneDataIsDirty,
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
