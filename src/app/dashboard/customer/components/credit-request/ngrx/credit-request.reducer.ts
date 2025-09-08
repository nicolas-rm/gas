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
            originalData: data, // Guardar datos originales al cargar
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
            error: null
        });
    }),
    
    // === SET DATA ===
    on(CreditRequestDataPageActions.setData, (state, { data }): CreditRequestDataState => {
        const withEntity = creditRequestDataAdapter.setOne(data, state);
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true; // en crear: cualquier cambio = sucio

        return {
            ...state,
            ...withEntity,
            data,
            // NO tocar originalData aquí
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),
    
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
            originalData: data, // Actualizar datos originales después de guardar exitosamente
            status: 'saved',
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        })
    ),
    
    on(CreditRequestDataApiActions.saveDataFailure, (state, { error }): CreditRequestDataState => ({
        ...state,
        status: 'error',
        saving: false,
        error: error.message
    })),
    
    // === FORM MANAGEMENT ===
    // Resetear formulario completamente (volver al estado inicial)
    on(CreditRequestDataPageActions.resetForm, (state): CreditRequestDataState => 
        creditRequestDataAdapter.removeAll({
            ...initialCreditRequestDataState
        })
    ),
    
    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(CreditRequestDataPageActions.resetToOriginal, (state): CreditRequestDataState => {
        const dataToRestore = state.originalData || null;
        
        if (dataToRestore) {
            return creditRequestDataAdapter.setOne(dataToRestore, {
                ...state,
                data: dataToRestore,
                hasUnsavedChanges: false,
                isDirty: false
            });
        } else {
            return creditRequestDataAdapter.removeAll({
                ...state,
                data: null,
                hasUnsavedChanges: false,
                isDirty: false
            });
        }
    }),

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
