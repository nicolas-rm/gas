import { createReducer, on } from '@ngrx/store';
import { ContactsDataPageActions, ContactsDataApiActions } from './contacts.actions';
import { contactsDataAdapter, initialContactsDataState, ContactsDataState } from './contacts.state';

export const contactsDataReducer = createReducer(
    initialContactsDataState,
    
    // === LOAD DATA ===
    on(ContactsDataPageActions.loadData, (state): ContactsDataState => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null
    })),
    
    on(ContactsDataApiActions.loadDataSuccess, (state, { data }): ContactsDataState => 
        contactsDataAdapter.setOne(data, {
            ...state,
            data,
            status: 'idle',
            loading: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        })
    ),
    
    on(ContactsDataApiActions.loadDataFailure, (state, { error }): ContactsDataState => ({
        ...state,
        status: 'error',
        loading: false,
        error: error.message
    })),
    
    // === UPDATE FIELD ===
    on(ContactsDataPageActions.updateField, (state, { field, value }): ContactsDataState => {
        const updatedData = {
            ...state.data,
            [field]: value
        };
        
        return contactsDataAdapter.setOne(updatedData, {
            ...state,
            data: updatedData,
            hasUnsavedChanges: true,
            isDirty: true,
            error: null
        });
    }),
    
    // === SET DATA ===
    on(ContactsDataPageActions.setData, (state, { data }): ContactsDataState => 
        contactsDataAdapter.setOne(data, {
            ...state,
            data,
            hasUnsavedChanges: true,
            isDirty: true,
            error: null
        })
    ),
    
    // === SAVE DATA ===
    on(ContactsDataPageActions.saveData, (state): ContactsDataState => ({
        ...state,
        status: 'saving',
        saving: true,
        error: null
    })),
    
    on(ContactsDataApiActions.saveDataSuccess, (state, { data }): ContactsDataState => 
        contactsDataAdapter.setOne(data, {
            ...state,
            data,
            status: 'saved',
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date().toISOString()
        })
    ),
    
    on(ContactsDataApiActions.saveDataFailure, (state, { error }): ContactsDataState => ({
        ...state,
        status: 'error',
        saving: false,
        error: error.message
    })),
    
    // === FORM MANAGEMENT ===
    on(ContactsDataPageActions.resetForm, (state): ContactsDataState => 
        contactsDataAdapter.removeAll({
            ...initialContactsDataState,
            data: {
                contacts: []
            }
        })
    ),
    
    on(ContactsDataPageActions.clearErrors, (state): ContactsDataState => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),
    
    on(ContactsDataPageActions.markAsPristine, (state): ContactsDataState => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false
    })),
    
    on(ContactsDataPageActions.markAsDirty, (state): ContactsDataState => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true
    }))
);