import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GeneralDataState } from './general-data.state';
import { GeneralData } from './general-data.models';

// Feature selector
export const selectGeneralDataState = createFeatureSelector<GeneralDataState>('generalData');

// === DATA SELECTORS ===
export const selectGeneralData = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.data
);

export const selectGeneralDataField = (field: keyof GeneralData) => createSelector(
    selectGeneralData,
    (data: GeneralData) => data[field]
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

export const selectGeneralDataLastSaved = createSelector(
    selectGeneralDataState,
    (state: GeneralDataState) => state.lastSaved
);

export const selectGeneralDataCanSave = createSelector(
    selectGeneralDataHasUnsavedChanges,
    selectGeneralDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

// === COMBINED SELECTORS ===
export const selectGeneralDataFormState = createSelector(
    selectGeneralData,
    selectGeneralDataStatus,
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    selectGeneralDataError,
    selectGeneralDataHasUnsavedChanges,
    selectGeneralDataIsDirty,
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
export const selectPersonType = createSelector(
    selectGeneralData,
    (data: GeneralData) => data.personType
);

export const selectGroupType = createSelector(
    selectGeneralData,
    (data: GeneralData) => data.groupType
);

export const selectRfc = createSelector(
    selectGeneralData,
    (data: GeneralData) => data.rfc
);

export const selectBusinessName = createSelector(
    selectGeneralData,
    (data: GeneralData) => data.businessName
);

export const selectTradeName = createSelector(
    selectGeneralData,
    (data: GeneralData) => data.tradeName
);

// === GROUPED SELECTORS ===
export const selectGeneralDataAddress = createSelector(
    selectGeneralData,
    (data: GeneralData) => ({
        street: data.street,
        exteriorNumber: data.exteriorNumber,
        interiorNumber: data.interiorNumber,
        crossing: data.crossing,
        country: data.country,
        state: data.state,
        colony: data.colony,
        municipality: data.municipality,
        postalCode: data.postalCode,
        city: data.city
    })
);

export const selectGeneralDataContact = createSelector(
    selectGeneralData,
    (data: GeneralData) => ({
        phone: data.phone,
        fax: data.fax
    })
);
