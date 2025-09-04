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

export const selectIneDataField = (field: keyof IneData) => createSelector(
    selectIneData,
    (data: IneData) => data[field]
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

export const selectIneDataLastSaved = createSelector(
    selectIneDataState,
    (state: IneDataState) => state.lastSaved
);

export const selectIneDataCanSave = createSelector(
    selectIneDataHasUnsavedChanges,
    selectIneDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

// === COMBINED SELECTORS ===
export const selectIneDataFormState = createSelector(
    selectIneData,
    selectIneDataStatus,
    selectIneDataLoading,
    selectIneDataSaving,
    selectIneDataError,
    selectIneDataHasUnsavedChanges,
    selectIneDataIsDirty,
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
export const selectAccountingKey = createSelector(
    selectIneData,
    (data: IneData) => data.accountingKey
);

export const selectProcessType = createSelector(
    selectIneData,
    (data: IneData) => data.processType
);

export const selectCommitteeType = createSelector(
    selectIneData,
    (data: IneData) => data.committeeType
);

export const selectScope = createSelector(
    selectIneData,
    (data: IneData) => data.scope
);

export const selectDocument = createSelector(
    selectIneData,
    (data: IneData) => data.document
);

// === GROUPED SELECTORS ===
export const selectIneDataConfiguration = createSelector(
    selectIneData,
    (data: IneData) => ({
        accountingKey: data.accountingKey,
        processType: data.processType,
        committeeType: data.committeeType,
        scope: data.scope
    })
);