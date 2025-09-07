// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { SaleDataState, initialSaleDataState } from './sale.state';
import { SaleDataPageActions, SaleDataApiActions } from './sale.actions';
import { SaleData } from './sale.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const saleDataAdapter: EntityAdapter<SaleData> = createEntityAdapter<SaleData>({
    selectId: (data: SaleData) => data.accountNumber || 'temp-id',
    sortComparer: false,
});

export const saleDataReducer = createReducer(
    initialSaleDataState,

    // === LOAD DATA ===
    on(SaleDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(SaleDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Guardar datos originales al cargar
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(SaleDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(SaleDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        data: {
            ...state.data,
            [field]: value,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(SaleDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(SaleDataPageActions.setData, (state, { data }) => ({
        ...state,
        data,
        // Si no hay datos originales, establecer estos como originales (modo crear)
        originalData: state.originalData || data,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    // === SAVE DATA ===
    on(SaleDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(SaleDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Actualizar datos originales después de guardar exitosamente
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(SaleDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(SaleDataPageActions.resetForm, () => initialSaleDataState),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(SaleDataPageActions.resetToOriginal, (state) => {
        const dataToRestore = state.originalData || {
            accountType: null,
            seller: null,
            accountNumber: null,
            prepaidType: null,
            creditDays: null,
            creditLimit: null,
            advanceCommission: null,
            paymentMethod: null,
            voucherAmount: null
        };
        
        return {
            ...state,
            data: dataToRestore,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),

    on(SaleDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(SaleDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(SaleDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
