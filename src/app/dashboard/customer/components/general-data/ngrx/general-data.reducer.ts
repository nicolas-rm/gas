// NgRx
import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { GeneralDataState, initialGeneralDataState } from '@/dashboard/customer/components/general-data/ngrx/general-data.state';
import { GeneralDataPageActions, GeneralDataApiActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';
import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';

// Entity Adapter para manejar colecciones si fuera necesario en el futuro
export const generalDataAdapter: EntityAdapter<GeneralData> = createEntityAdapter<GeneralData>({
    selectId: (data: GeneralData) => data.rfc || 'temp-id',
    sortComparer: false,
});

export const generalDataReducer = createReducer<GeneralDataState>(
    generalDataAdapter.getInitialState(initialGeneralDataState),

    // === LOAD DATA ===
    on(GeneralDataPageActions.loadData, (state: GeneralDataState) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null,
    })),

    on(GeneralDataApiActions.loadDataSuccess, (state: GeneralDataState, { data }) => {
        const withEntity = generalDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: 'idle' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: Date.now(),
        };
    }),

    on(GeneralDataApiActions.loadDataFailure, (state: GeneralDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error: error.message,
    })),

    // === UPDATE FIELDS ===
    on(GeneralDataPageActions.updateField, (state: GeneralDataState, { field, value }) => {
        const currentData = state.data || {
            personType: null,
            groupType: null,
            rfc: null,
            businessName: null,
            tradeName: null,
            street: null,
            exteriorNumber: null,
            interiorNumber: null,
            crossing: null,
            country: null,
            state: null,
            colony: null,
            municipality: null,
            postalCode: null,
            phone: null,
            city: null,
            fax: null
        };
        const updatedData = {
            ...currentData,
            [field]: value,
        };
        const withEntity = generalDataAdapter.setOne(updatedData, state);
        
        return {
            ...withEntity,
            data: updatedData,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: true,
            isDirty: true,
            lastSaved: state.lastSaved
        };
    }),

    on(GeneralDataPageActions.updateMultipleFields, (state: GeneralDataState, { updates }) => {
        const currentData = state.data || {
            personType: null,
            groupType: null,
            rfc: null,
            businessName: null,
            tradeName: null,
            street: null,
            exteriorNumber: null,
            interiorNumber: null,
            crossing: null,
            country: null,
            state: null,
            colony: null,
            municipality: null,
            postalCode: null,
            phone: null,
            city: null,
            fax: null
        };
        const updatedData = {
            ...currentData,
            ...updates,
        };
        const withEntity = generalDataAdapter.setOne(updatedData, state);
        
        return {
            ...withEntity,
            data: updatedData,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: true,
            isDirty: true,
            lastSaved: state.lastSaved
        };
    }),

    on(GeneralDataPageActions.setData, (state: GeneralDataState, { data }) => {
        const withEntity = generalDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: state.status,
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: state.lastSaved
        };
    }),

    // === SAVE DATA ===
    on(GeneralDataPageActions.saveData, (state: GeneralDataState) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null,
    })),

    on(GeneralDataApiActions.saveDataSuccess, (state: GeneralDataState, { data }) => {
        const withEntity = generalDataAdapter.setOne(data, state);
        
        return {
            ...withEntity,
            data,
            status: 'saved' as const,
            loading: false,
            saving: false,
            error: null,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: Date.now(),
        };
    }),

    on(GeneralDataApiActions.saveDataFailure, (state: GeneralDataState, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error: error.message,
    })),

    // === RESET Y LIMPIEZA ===
    on(GeneralDataPageActions.resetForm, () => generalDataAdapter.getInitialState(initialGeneralDataState)),

    on(GeneralDataPageActions.clearErrors, (state: GeneralDataState) => ({
        ...state,
        error: null,
        status: state.status === 'error' ? 'idle' : state.status
    })),

    on(GeneralDataPageActions.markAsPristine, (state: GeneralDataState) => ({
        ...state,
        hasUnsavedChanges: false,
        isDirty: false,
    })),

    on(GeneralDataPageActions.markAsDirty, (state: GeneralDataState) => ({
        ...state,
        hasUnsavedChanges: true,
        isDirty: true,
    }))
);

// Selectores del adapter para listar entidades o IDs
export const { selectIds, selectEntities, selectAll, selectTotal } = generalDataAdapter.getSelectors();
