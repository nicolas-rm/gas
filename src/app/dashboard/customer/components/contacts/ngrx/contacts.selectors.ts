import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactsDataState } from './contacts.state';
import { ContactsData } from './contacts.models';

// Feature selector
export const selectContactsDataState = createFeatureSelector<ContactsDataState>('contactsData');

// === DATA SELECTORS ===
export const selectContactsData = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.data
);

export const selectContactsDataField = (field: keyof ContactsData) => createSelector(
    selectContactsData,
    (data: ContactsData) => data[field]
);

// === STATUS SELECTORS ===
export const selectContactsDataStatus = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.status
);

export const selectContactsDataLoading = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.loading
);

export const selectContactsDataSaving = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.saving
);

export const selectContactsDataIsBusy = createSelector(
    selectContactsDataLoading,
    selectContactsDataSaving,
    (loading: boolean, saving: boolean) => loading || saving
);

// === ERROR SELECTORS ===
export const selectContactsDataError = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.error
);

// === CHANGE TRACKING SELECTORS ===
export const selectContactsDataHasUnsavedChanges = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.hasUnsavedChanges
);

export const selectContactsDataIsDirty = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.isDirty
);

export const selectContactsDataLastSaved = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.lastSaved
);

export const selectContactsDataCanSave = createSelector(
    selectContactsDataHasUnsavedChanges,
    selectContactsDataSaving,
    (hasUnsavedChanges: boolean, saving: boolean) =>
        hasUnsavedChanges && !saving
);

// === COMBINED SELECTORS ===
export const selectContactsDataFormState = createSelector(
    selectContactsData,
    selectContactsDataStatus,
    selectContactsDataLoading,
    selectContactsDataSaving,
    selectContactsDataError,
    selectContactsDataHasUnsavedChanges,
    selectContactsDataIsDirty,
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
export const selectContacts = createSelector(
    selectContactsData,
    (data: ContactsData) => data.contacts
);

// === GROUPED SELECTORS ===
export const selectContactsDataSummary = createSelector(
    selectContactsData,
    (data: ContactsData) => ({
        totalContacts: data.contacts.length,
        hasContacts: data.contacts.length > 0
    })
);