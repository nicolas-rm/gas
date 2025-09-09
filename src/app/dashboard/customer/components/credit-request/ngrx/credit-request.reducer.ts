import { createReducer, on } from '@ngrx/store';
import { CreditRequestDataPageActions, CreditRequestDataApiActions } from './credit-request.actions';
import { creditRequestDataAdapter, initialCreditRequestDataState, CreditRequestDataState } from './credit-request.state';

export const creditRequestDataReducer = createReducer(
    initialCreditRequestDataState,
    
    // === LOAD DATA ===
    on(CreditRequestDataPageActions.loadData, (state): CreditRequestDataState => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null
    })),
    
    on(CreditRequestDataApiActions.loadDataSuccess, (state, { data }): CreditRequestDataState => {
        const withEntity = creditRequestDataAdapter.setOne(data, state);
        
        return {
            ...state,
            ...withEntity,
            data,
            originalData: data, // Guardar datos originales al cargar
            status: 'idle' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),
    
    on(CreditRequestDataApiActions.loadDataFailure, (state, { error }): CreditRequestDataState => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message
    })),
    
    // === SET DATA (snapshot completo) ===
    on(CreditRequestDataPageActions.setData, (state, { data }): CreditRequestDataState => {
        const withEntity = creditRequestDataAdapter.setOne(data, state);
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true; // en crear: cualquier cambio = sucio

        return {
            ...state,
            ...withEntity,
            data: data,
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),
    
    // === SAVE DATA ===
    on(CreditRequestDataPageActions.saveData, (state): CreditRequestDataState => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),
    
    on(CreditRequestDataApiActions.saveDataSuccess, (state, { data }): CreditRequestDataState => {
        const withEntity = creditRequestDataAdapter.setOne(data, state);
        
        return {
            ...state,
            ...withEntity,
            data,
            originalData: data, // Actualizar datos originales después de guardar exitosamente
            status: 'saved' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),
    
    on(CreditRequestDataApiActions.saveDataFailure, (state, { error }): CreditRequestDataState => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message
    })),
    
    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(CreditRequestDataPageActions.resetForm, (): CreditRequestDataState => ({
        ...initialCreditRequestDataState
    })),
    
    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(CreditRequestDataPageActions.resetToOriginal, (state): CreditRequestDataState => {
        const dataToRestore = state.originalData || null;
        
        if (dataToRestore) {
            const withEntity = creditRequestDataAdapter.setOne(dataToRestore, state);
            return {
                ...state,
                ...withEntity,
                data: dataToRestore,
                hasUnsavedChanges: false,
                isDirty: false,
                error: null
            };
        } else {
            return {
                ...initialCreditRequestDataState,
                data: null,
                originalData: null,
                hasUnsavedChanges: false,
                isDirty: false
            };
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

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = creditRequestDataAdapter.getSelectors();
