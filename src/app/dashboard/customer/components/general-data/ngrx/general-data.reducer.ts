// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { GeneralDataState, initialGeneralDataState } from './general-data.state';
import { GeneralDataPageActions, GeneralDataApiActions } from './general-data.actions';
import { GeneralData } from './general-data.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const generalDataAdapter: EntityAdapter<GeneralData> = createEntityAdapter<GeneralData>({
    selectId: (data: GeneralData) => data.rfc || 'temp-id',
    sortComparer: false,
});

export const generalDataReducer = createReducer(
    initialGeneralDataState,

    // === LOAD DATA ===
    on(GeneralDataPageActions.loadData, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(GeneralDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'idle' as const,
        loading: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(GeneralDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(GeneralDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        data: {
            ...state.data,
            [field]: value,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(GeneralDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        data: {
            ...state.data,
            ...updates,
        },
        hasUnsavedChanges: true,
        isDirty: true,
    })),

    on(GeneralDataPageActions.setData, (state, { data }) => ({
        ...state,
        data,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    // === SAVE DATA ===
    on(GeneralDataPageActions.saveData, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(GeneralDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        data,
        status: 'saved' as const,
        saving: false,
        error: null,
        hasUnsavedChanges: false,
        isDirty: false,
        lastSaved: Date.now(),
    })),

    on(GeneralDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    on(GeneralDataPageActions.resetForm, () => initialGeneralDataState),

    on(GeneralDataPageActions.clearErrors, (state) => ({
        ...state,
        error: null,
    })),

    on(GeneralDataPageActions.markAsPristine, (state) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(GeneralDataPageActions.markAsDirty, (state) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);
