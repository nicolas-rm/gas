import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GeneralDataState } from '@/dashboard/customer/components/general-data/ngrx/general-data.state';
import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';

// Feature selector
export const selectGeneralDataState = createFeatureSelector<GeneralDataState>('generalData');

// === DATA SELECTORS ===
export const selectGeneralData = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.data
);

export const selectGeneralDataOriginal = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.originalData
);

export const selectGeneralDataField = (field: keyof GeneralData) => createSelector(
    selectGeneralData,
    (data: GeneralData | null) => data ? data[field] : null
);

// === STATUS SELECTORS ===
export const selectGeneralDataStatus = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.status
);

export const selectGeneralDataLoading = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.loading
);

export const selectGeneralDataSaving = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.saving
);

export const selectGeneralDataIsBusy = createSelector(
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectGeneralDataError = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectGeneralDataHasUnsavedChanges = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.hasUnsavedChanges
);

export const selectGeneralDataIsDirty = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.isDirty
);

export const selectGeneralDataCanSave = createSelector(
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    selectGeneralDataError,
    selectGeneralDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectGeneralDataCanReset = createSelector(
    selectGeneralDataHasUnsavedChanges,
    selectGeneralDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// (Removidos selectores granulares y agrupados no utilizados para simplificar la superficie del estado)
