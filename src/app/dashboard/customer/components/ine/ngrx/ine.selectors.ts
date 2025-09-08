import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IneDataState } from './ine.state';
import { IneData } from './ine.models';

// Feature selector
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

// === FORM STATE SELECTOR ===
// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)
