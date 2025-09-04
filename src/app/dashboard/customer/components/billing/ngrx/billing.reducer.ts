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
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
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
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(BillingDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(BillingDataPageActions.setData, (state, { data }) => ({
        ...state,
        data,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

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
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(BillingDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    on(BillingDataPageActions.resetForm, () => initialBillingDataState),

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