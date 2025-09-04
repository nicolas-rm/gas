import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerDataState, customerAdapter } from './customer.state';

// Feature selector
export const selectCustomerState = createFeatureSelector<CustomerDataState>('customer');

// Entity selectors
const {
    selectIds: selectCustomerIds,
    selectEntities: selectCustomerEntities,
    selectAll: selectAllCustomers,
    selectTotal: selectCustomersTotal
} = customerAdapter.getSelectors(selectCustomerState);

export { selectCustomerIds, selectCustomerEntities, selectAllCustomers, selectCustomersTotal };

// Basic selectors
export const selectSelectedCustomerId = createSelector(
    selectCustomerState,
    (state) => state.selectedCustomerId
);

export const selectSelectedCustomer = createSelector(
    selectCustomerEntities,
    selectSelectedCustomerId,
    (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectCustomerStatus = createSelector(
    selectCustomerState,
    (state) => state.status
);

export const selectCustomerLoading = createSelector(
    selectCustomerState,
    (state) => state.loading
);

export const selectCustomerSaving = createSelector(
    selectCustomerState,
    (state) => state.saving
);

export const selectCustomerError = createSelector(
    selectCustomerState,
    (state) => state.error
);

export const selectLastUpdated = createSelector(
    selectCustomerState,
    (state) => state.lastUpdated
);

// Control state selectors
export const selectCustomerControl = createSelector(
    selectCustomerState,
    (state) => state.control
);

export const selectHasUnsavedChanges = createSelector(
    selectCustomerControl,
    (control) => control.hasUnsavedChanges
);

export const selectIsDirty = createSelector(
    selectCustomerControl,
    (control) => control.isDirty
);

export const selectLastSaved = createSelector(
    selectCustomerControl,
    (control) => control.lastSaved
);

export const selectCurrentSection = createSelector(
    selectCustomerControl,
    (control) => control.currentSection
);

export const selectIsFormValid = createSelector(
    selectCustomerControl,
    (control) => control.isFormValid
);

// Combined selectors
export const selectCustomerFormState = createSelector(
    selectCustomerLoading,
    selectCustomerSaving,
    selectCustomerError,
    selectHasUnsavedChanges,
    selectIsDirty,
    (loading, saving, error, hasUnsavedChanges, isDirty) => ({
        loading,
        saving,
        error,
        hasUnsavedChanges,
        isDirty,
        isProcessing: loading || saving
    })
);

// Sub-state selectors
export const selectGeneralDataState = createSelector(
    selectCustomerState,
    (state) => state.generalData
);

export const selectContractState = createSelector(
    selectCustomerState,
    (state) => state.contract
);

export const selectCommissionState = createSelector(
    selectCustomerState,
    (state) => state.commission
);

export const selectSaleState = createSelector(
    selectCustomerState,
    (state) => state.sale
);

export const selectBillingState = createSelector(
    selectCustomerState,
    (state) => state.billing
);

export const selectContactsState = createSelector(
    selectCustomerState,
    (state) => state.contacts
);

export const selectIneState = createSelector(
    selectCustomerState,
    (state) => state.ine
);

export const selectCreditRequestState = createSelector(
    selectCustomerState,
    (state) => state.creditRequest
);

// Customer by ID selector
export const selectCustomerById = (customerId: string) => createSelector(
    selectCustomerEntities,
    (entities) => entities[customerId]
);

// Section data selectors
// Remover selectores rotos (líneas 103-140)
// Corregir selectCustomerSectionData:
export const selectCustomerSectionData = (section: CustomerFormSection) => createSelector(
    selectSelectedCustomer,
    (customer) => {
        if (!customer) return null;
        switch (section) {
            case 'generalData': return customer.generalData;
            case 'contractData': return customer.contractData;
            case 'commissionData': return customer.commissionData;
            case 'saleData': return customer.saleData;
            case 'billingData': return customer.billingData;
            case 'contacts': return customer.contacts;
            case 'ineData': return customer.ineData;
            case 'creditRequestData': return customer.creditRequestData;
            default: return null;
        }
    }
);

// Selectores específicos que SÍ funcionan:
export const selectCustomerGeneralData = createSelector(
    selectSelectedCustomer,
    (customer) => customer?.generalData || null
);

export const selectCustomerContractData = createSelector(
    selectSelectedCustomer,
    (customer) => customer?.contractData || null
);

// Y así para cada sección...
