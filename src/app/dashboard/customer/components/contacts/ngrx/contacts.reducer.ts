// NgRx
import { createReducer, on } from '@ngrx/store';

import { ContactsDataState, initialContactsDataState } from '@/dashboard/customer/components/contacts/ngrx/contacts.state';
import { ContactsDataPageActions, ContactsDataApiActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';

export const contactsDataReducer = createReducer(
    initialContactsDataState,

    // === LOAD DATA ===
    on(ContactsDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(ContactsDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(ContactsDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(ContactsDataPageActions.updateField, (state, { field, value }) => {
        const currentData = state.data || { contacts: [] };
        // Para contacts, el único field válido es 'contacts' que es un array
        if (field === 'contacts' && Array.isArray(value)) {
            return {
                ...state,
                data: {
                    ...currentData,
                    contacts: value,
                },
                hasUnsavedChanges: true,
                isDirty: true,
            };
        }
        return state;
    }),

    on(ContactsDataPageActions.updateMultipleFields, (state, { updates }) => {
        const currentData = state.data || { contacts: [] };
        return {
            ...state,
            data: {
                ...currentData,
                ...updates,
            },
            hasUnsavedChanges: true,
            isDirty: true,
        };
    }),

    on(ContactsDataPageActions.setData, (state, { data }) => ({
        ...state,
        data,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    // === SAVE DATA ===
    on(ContactsDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(ContactsDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(ContactsDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    on(ContactsDataPageActions.resetForm, () => initialContactsDataState),

    on(ContactsDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(ContactsDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(ContactsDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
