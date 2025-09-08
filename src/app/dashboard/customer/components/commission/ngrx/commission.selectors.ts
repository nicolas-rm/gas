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

export const selectCommissionDataOriginal = createSelector(
    selectCommissionDataState,
    (state: CommissionDataState) => state.originalData
);

export const selectCommissionDataField = (field: keyof CommissionData) => createSelector(
    selectCommissionData,
    (data: CommissionData | null) => data ? data[field] : null
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

export const selectCommissionDataCanReset = createSelector(
    selectCommissionDataHasUnsavedChanges,
    selectCommissionDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// (Se eliminó lastSaved: ya no existe en el estado estandarizado)

// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)

// (Removidos selectores granulares específicos de campos no utilizados para simplificar la superficie del estado)
