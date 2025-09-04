import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CreditRequestDataState } from './credit-request.state';
import { CreditRequestData } from './credit-request.models';

// Feature selector
export const selectCreditRequestDataState = createFeatureSelector<CreditRequestDataState>('creditRequestData');

// === DATA SELECTORS ===
export const selectCreditRequestData = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.data
);

export const selectCreditRequestDataField = (field: keyof CreditRequestData) => createSelector(
    selectCreditRequestData,
    (data: CreditRequestData) => data[field]
);

// === STATUS SELECTORS ===
export const selectCreditRequestDataStatus = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.status
);

export const selectCreditRequestDataLoading = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.loading
);

export const selectCreditRequestDataSaving = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.saving
);

export const selectCreditRequestDataIsBusy = createSelector(
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectCreditRequestDataError = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectCreditRequestDataHasUnsavedChanges = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.hasUnsavedChanges
);

export const selectCreditRequestDataIsDirty = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.isDirty
);

export const selectCreditRequestDataLastSaved = createSelector(
    selectCreditRequestDataState,
    (state: CreditRequestDataState) => state.lastSaved
);

export const selectCreditRequestDataCanSave = createSelector(
    selectCreditRequestDataHasUnsavedChanges,
    selectCreditRequestDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

// === COMBINED SELECTORS ===
export const selectCreditRequestDataFormState = createSelector(
    selectCreditRequestData,
    selectCreditRequestDataStatus,
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    selectCreditRequestDataError,
    selectCreditRequestDataHasUnsavedChanges,
    selectCreditRequestDataIsDirty,
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
export const selectLegalRepresentative = createSelector(
    selectCreditRequestData,
    (data: CreditRequestData) => data.legalRepresentative
);

export const selectDocumentsReceiver = createSelector(
    selectCreditRequestData,
    (data: CreditRequestData) => data.documentsReceiver
);

export const selectCreditApplicationDocument = createSelector(
    selectCreditRequestData,
    (data: CreditRequestData) => data.creditApplicationDocument
);

// === GROUPED SELECTORS ===
export const selectCreditRequestDataSummary = createSelector(
    selectCreditRequestData,
    (data: CreditRequestData) => ({
        hasLegalRepresentative: !!data.legalRepresentative,
        hasDocumentsReceiver: !!data.documentsReceiver,
        hasDocument: !!data.creditApplicationDocument,
        isComplete: !!data.legalRepresentative && !!data.documentsReceiver
    })
);