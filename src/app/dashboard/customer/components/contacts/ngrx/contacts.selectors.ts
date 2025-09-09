import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactsDataState } from './contacts.state';
import { ContactsData, ContactData } from './contacts.models';

// === HELPERS PARA NORMALIZACIÓN ===
export const isEmptyContact = (contact?: ContactData | null): boolean => {
    if (!contact) return true;
    const trim = (value: unknown) => typeof value === 'string' ? value.trim() : value;
    return [contact.name, contact.position, contact.phone, contact.email]
        .map(trim)
        .every(value => !value);
};

export const normalizeContactsData = (data?: ContactsData | null): ContactsData => {
    const contacts = (data?.contacts ?? []).filter(contact => !isEmptyContact(contact));
    return { contacts };
};

// Feature selector
export const selectContactsDataState = createFeatureSelector<ContactsDataState>('contactsData');

// === DATA SELECTORS ===
export const selectContactsData = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.data
);

export const selectContactsDataOriginal = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.originalData
);

export const selectContactsDataField = (field: keyof ContactsData) => createSelector(
    selectContactsData,
    (data: ContactsData | null) => data ? data[field] : null
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

// === NORMALIZED DATA SELECTORS ===
export const selectContactsDataNormalized = createSelector(
    selectContactsData,
    (data) => normalizeContactsData(data)
);

export const selectContactsDataOriginalNormalized = createSelector(
    selectContactsDataOriginal,
    (data) => normalizeContactsData(data)
);

// === CHANGE TRACKING SELECTORS ===
export const selectContactsDataHasUnsavedChanges = createSelector(
    selectContactsDataNormalized,
    selectContactsDataOriginalNormalized,
    (current, original) => {
        return JSON.stringify(current) !== JSON.stringify(original);
    }
);

export const selectContactsDataIsDirty = createSelector(
    selectContactsDataState,
    (state: ContactsDataState) => state.isDirty
);

export const selectContactsDataCanSave = createSelector(
    selectContactsDataLoading,
    selectContactsDataSaving,
    selectContactsDataError,
    selectContactsDataHasUnsavedChanges,
    (loading: boolean, saving: boolean, error: string | null, hasUnsavedChanges: boolean) =>
        !loading && !saving && !error && hasUnsavedChanges
);

export const selectContactsDataCanReset = createSelector(
    selectContactsDataHasUnsavedChanges,
    selectContactsDataIsBusy,
    (hasUnsavedChanges: boolean, isBusy: boolean) =>
        hasUnsavedChanges && !isBusy
);

// === FORM STATE SELECTOR ===
// (Removidos selectores granulares específicos de campos y agrupados no utilizados para simplificar la superficie del estado)
