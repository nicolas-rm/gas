// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { BillingDataState, initialBillingDataState } from './billing.state';
import { BillingDataPageActions, BillingDataApiActions } from './billing.actions';
import { BillingData } from './billing.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const billingDataAdapter: EntityAdapter<BillingData> = createEntityAdapter<BillingData>({
    selectId: (data: BillingData) => data.billingEmails || 'temp-id',
    sortComparer: false,
});

export const billingDataReducer = createReducer(
    initialBillingDataState,

    // === LOAD DATA ===
    on(BillingDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(BillingDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Guardar datos originales al cargar
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(BillingDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(BillingDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        data: {
            ...state.data,
            [field]: value,
        },
    })),

    on(BillingDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
    })),

    on(BillingDataPageActions.setData, (state, { data }) => {
        const changed = state.originalData
            ? JSON.stringify(state.originalData) !== JSON.stringify(data)
            : true;
        return {
            ...state,
            data,
            hasUnsavedChanges: changed,
            isDirty: changed,
        };
    }),

    // === SAVE DATA ===
    on(BillingDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(BillingDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        originalData: data, // Actualizar datos originales después de guardar exitosamente
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(BillingDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    // Resetear formulario completamente (volver al estado inicial)
    on(BillingDataPageActions.resetForm, () => initialBillingDataState),

    // Restablecer a datos originales (crear: campos vacíos, actualizar: datos cargados)
    on(BillingDataPageActions.resetToOriginal, (state) => {
        const dataToRestore = state.originalData || {
            invoiceRepresentation: null,
            billingDays: null,
            billingEmails: null,
            billingFrequency: null,
            startDate: null,
            endDate: null,
            automaticBilling: null
        };
        
        return {
            ...state,
            data: dataToRestore,
            hasUnsavedChanges: false,
            isDirty: false
        };
    }),

    on(BillingDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(BillingDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(BillingDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
