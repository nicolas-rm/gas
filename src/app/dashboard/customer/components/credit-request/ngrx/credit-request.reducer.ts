import { createReducer, on } from '@ngrx/store';
import { CreditRequestDataPageActions, CreditRequestDataApiActions } from './credit-request.actions';
import { creditRequestDataAdapter, initialCreditRequestDataState, CreditRequestDataState } from './credit-request.state';

export const creditRequestDataReducer = createReducer(
    initialCreditRequestDataState,
    
    // === LOAD DATA ===
    on(CreditRequestDataPageActions.loadData, (state): CreditRequestDataState => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null
    })),
    
    on(CreditRequestDataApiActions.loadDataSuccess, (state, { data }): CreditRequestDataState => 
        creditRequestDataAdapter.setOne(data, {
            ...state,
            data,
            status: 'idle',
            loading: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        })
    ),
    
    on(CreditRequestDataApiActions.loadDataFailure, (state, { error }): CreditRequestDataState => ({
        ...state,
        status: 'error',
        loading: false,
        error: error.message
    })),
    
    // === UPDATE FIELD ===
    on(CreditRequestDataPageActions.updateField, (state, { field, value }): CreditRequestDataState => {
        const currentData = state.data || {
            legalRepresentative: null,
            documentsReceiver: null,
            creditApplicationDocument: null
        };
        const updatedData = {
            ...currentData,
            [field]: value
        };
        
        return creditRequestDataAdapter.setOne(updatedData, {
            ...state,
            data: updatedData,
            hasUnsavedChanges: true,
            isDirty: true,
            error: null
        });
    }),
    
    // === SET DATA ===
    on(CreditRequestDataPageActions.setData, (state, { data }): CreditRequestDataState => 
        creditRequestDataAdapter.setOne(data, {
            ...state,
            data,
            hasUnsavedChanges: true,
            isDirty: true,
            error: null
        })
    ),
    
    // === SAVE DATA ===
    on(CreditRequestDataPageActions.saveData, (state): CreditRequestDataState => ({
        ...state,
        status: 'saving',
        saving: true,
        error: null
    })),
    
    on(CreditRequestDataApiActions.saveDataSuccess, (state, { data }): CreditRequestDataState => 
        creditRequestDataAdapter.setOne(data, {
            ...state,
            data,
            status: 'saved',
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: Date.now()
        })
    ),
    
    on(CreditRequestDataApiActions.saveDataFailure, (state, { error }): CreditRequestDataState => ({
        ...state,
        status: 'error',
        saving: false,
        error: error.message
    })),
    
    // === FORM MANAGEMENT ===
    on(CreditRequestDataPageActions.resetForm, (state): CreditRequestDataState => 
        creditRequestDataAdapter.removeAll({
            ...initialCreditRequestDataState
        })
    ),
    
    on(CreditRequestDataPageActions.clearErrors, (state): CreditRequestDataState => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),
    
    on(CreditRequestDataPageActions.markAsPristine, (state): CreditRequestDataState => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false
    })),
    
    on(CreditRequestDataPageActions.markAsDirty, (state): CreditRequestDataState => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true
    }))
);
