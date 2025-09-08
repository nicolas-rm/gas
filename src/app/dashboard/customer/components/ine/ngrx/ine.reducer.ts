import { createReducer, on } from '@ngrx/store';
import { IneDataPageActions, IneDataApiActions } from './ine.actions';
import { ineDataAdapter, initialIneDataState, IneDataState } from './ine.state';

export const ineDataReducer = createReducer(
    initialIneDataState,
    
    // === LOAD DATA ===
    on(IneDataPageActions.loadData, (state): IneDataState => ({
        ...state,
        status: 'loading',
        loading: true,
        error: null
    })),
    
    on(IneDataApiActions.loadDataSuccess, (state, { data }): IneDataState => 
        ineDataAdapter.setOne(data, {
            ...state,
            data,
            originalData: data, // Guardar datos originales
            status: 'idle',
            loading: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        })
    ),
    
    on(IneDataApiActions.loadDataFailure, (state, { error }): IneDataState => ({
        ...state,
        status: 'error',
        loading: false,
        error: error.message
    })),
    
    // === UPDATE FIELD ===
    on(IneDataPageActions.updateField, (state, { field, value }): IneDataState => {
        const currentData = state.data || {
            accountingKey: null,
            processType: null,
            committeeType: null,
            scope: null,
            document: null
        };
        const updatedData = {
            ...currentData,
            [field]: value
        };
        return ineDataAdapter.setOne(updatedData, {
            ...state,
            data: updatedData,
            error: null
        });
    }),
    
    // === SET DATA ===
    on(IneDataPageActions.setData, (state, { data }): IneDataState => {
        const withEntity = ineDataAdapter.setOne(data, state);
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true;
        return {
            ...state,
            ...withEntity,
            data,
            hasUnsavedChanges: changed,
            isDirty: changed,
            error: null
        };
    }),
    
    // === SAVE DATA ===
    on(IneDataPageActions.saveData, (state): IneDataState => ({
        ...state,
        status: 'saving',
        saving: true,
        error: null
    })),
    
    on(IneDataApiActions.saveDataSuccess, (state, { data }): IneDataState => 
        ineDataAdapter.setOne(data, {
            ...state,
            data,
            originalData: data, // Actualizar datos originales después de guardar
            status: 'saved',
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        })
    ),
    
    on(IneDataApiActions.saveDataFailure, (state, { error }): IneDataState => ({
        ...state,
        status: 'error',
        saving: false,
        error: error.message
    })),
    
    // === FORM MANAGEMENT ===
    on(IneDataPageActions.resetForm, (state): IneDataState => 
        ineDataAdapter.removeAll({
            ...initialIneDataState
        })
    ),
    
    on(IneDataPageActions.clearErrors, (state): IneDataState => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),
    
    on(IneDataPageActions.markAsPristine, (state): IneDataState => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false
    })),
    
    on(IneDataPageActions.markAsDirty, (state): IneDataState => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true
    })),

    // === RESET TO ORIGINAL ===
    on(IneDataPageActions.resetToOriginal, (state): IneDataState => {
        if (!state.originalData) {
            return state;
        }
        return ineDataAdapter.setOne(state.originalData, {
            ...state,
            data: state.originalData,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        });
    })
);
