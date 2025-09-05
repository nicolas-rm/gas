import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerDataState, customerAdapter } from './customer.state';
import { 
    CustomerFormSection,
    GeneralData,
    ContractData,
    CommissionData,
    SaleData,
    BillingData,
    ContactsData,
    IneData,
    CreditRequestData
} from './customer.models';

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

// ========== SECTION STATE SELECTORS ==========

// General Data selectors
export const selectGeneralDataState = createSelector(
    selectCustomerState,
    (state) => state.generalData
);

export const selectGeneralData = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.data
);

export const selectGeneralDataStatus = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.status
);

export const selectGeneralDataLoading = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.loading
);

export const selectGeneralDataSaving = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.saving
);

export const selectGeneralDataError = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.error
);

export const selectGeneralDataHasUnsavedChanges = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectGeneralDataIsDirty = createSelector(
    selectGeneralDataState,
    (sectionState) => sectionState.isDirty
);

export const selectGeneralDataField = (field: keyof GeneralData) => createSelector(
    selectGeneralData,
    (data) => data[field]
);

// Contract Data selectors
export const selectContractDataState = createSelector(
    selectCustomerState,
    (state) => state.contractData
);

export const selectContractData = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.data
);

export const selectContractDataStatus = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.status
);

export const selectContractDataLoading = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.loading
);

export const selectContractDataSaving = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.saving
);

export const selectContractDataError = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.error
);

export const selectContractDataHasUnsavedChanges = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectContractDataIsDirty = createSelector(
    selectContractDataState,
    (sectionState) => sectionState.isDirty
);

export const selectContractDataField = (field: keyof ContractData) => createSelector(
    selectContractData,
    (data) => data[field]
);

// Commission Data selectors
export const selectCommissionDataState = createSelector(
    selectCustomerState,
    (state) => state.commissionData
);

export const selectCommissionData = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.data
);

export const selectCommissionDataStatus = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.status
);

export const selectCommissionDataLoading = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.loading
);

export const selectCommissionDataSaving = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.saving
);

export const selectCommissionDataError = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.error
);

export const selectCommissionDataHasUnsavedChanges = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectCommissionDataIsDirty = createSelector(
    selectCommissionDataState,
    (sectionState) => sectionState.isDirty
);

export const selectCommissionDataField = (field: keyof CommissionData) => createSelector(
    selectCommissionData,
    (data) => data[field]
);

// Sale Data selectors
export const selectSaleDataState = createSelector(
    selectCustomerState,
    (state) => state.saleData
);

export const selectSaleData = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.data
);

export const selectSaleDataStatus = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.status
);

export const selectSaleDataLoading = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.loading
);

export const selectSaleDataSaving = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.saving
);

export const selectSaleDataError = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.error
);

export const selectSaleDataHasUnsavedChanges = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectSaleDataIsDirty = createSelector(
    selectSaleDataState,
    (sectionState) => sectionState.isDirty
);

export const selectSaleDataField = (field: keyof SaleData) => createSelector(
    selectSaleData,
    (data) => data[field]
);

// Billing Data selectors
export const selectBillingDataState = createSelector(
    selectCustomerState,
    (state) => state.billingData
);

export const selectBillingData = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.data
);

export const selectBillingDataStatus = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.status
);

export const selectBillingDataLoading = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.loading
);

export const selectBillingDataSaving = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.saving
);

export const selectBillingDataError = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.error
);

export const selectBillingDataHasUnsavedChanges = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectBillingDataIsDirty = createSelector(
    selectBillingDataState,
    (sectionState) => sectionState.isDirty
);

export const selectBillingDataField = (field: keyof BillingData) => createSelector(
    selectBillingData,
    (data) => data[field]
);

// Contacts Data selectors
export const selectContactsDataState = createSelector(
    selectCustomerState,
    (state) => state.contactsData
);

export const selectContactsData = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.data
);

export const selectContactsDataStatus = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.status
);

export const selectContactsDataLoading = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.loading
);

export const selectContactsDataSaving = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.saving
);

export const selectContactsDataError = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.error
);

export const selectContactsDataHasUnsavedChanges = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectContactsDataIsDirty = createSelector(
    selectContactsDataState,
    (sectionState) => sectionState.isDirty
);

// INE Data selectors
export const selectIneDataState = createSelector(
    selectCustomerState,
    (state) => state.ineData
);

export const selectIneData = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.data
);

export const selectIneDataStatus = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.status
);

export const selectIneDataLoading = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.loading
);

export const selectIneDataSaving = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.saving
);

export const selectIneDataError = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.error
);

export const selectIneDataHasUnsavedChanges = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectIneDataIsDirty = createSelector(
    selectIneDataState,
    (sectionState) => sectionState.isDirty
);

export const selectIneDataField = (field: keyof IneData) => createSelector(
    selectIneData,
    (data) => data[field]
);

// Credit Request Data selectors
export const selectCreditRequestDataState = createSelector(
    selectCustomerState,
    (state) => state.creditRequestData
);

export const selectCreditRequestData = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.data
);

export const selectCreditRequestDataStatus = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.status
);

export const selectCreditRequestDataLoading = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.loading
);

export const selectCreditRequestDataSaving = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.saving
);

export const selectCreditRequestDataError = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.error
);

export const selectCreditRequestDataHasUnsavedChanges = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.hasUnsavedChanges
);

export const selectCreditRequestDataIsDirty = createSelector(
    selectCreditRequestDataState,
    (sectionState) => sectionState.isDirty
);

export const selectCreditRequestDataField = (field: keyof CreditRequestData) => createSelector(
    selectCreditRequestData,
    (data) => data[field]
);

// ========== HELPER SELECTORS ==========

// Customer by ID selector
export const selectCustomerById = (customerId: string) => createSelector(
    selectCustomerEntities,
    (entities) => entities[customerId]
);

// Section-specific busy states
export const selectGeneralDataIsBusy = createSelector(
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    (loading, saving) => loading || saving
);

export const selectContractDataIsBusy = createSelector(
    selectContractDataLoading,
    selectContractDataSaving,
    (loading, saving) => loading || saving
);

export const selectCommissionDataIsBusy = createSelector(
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    (loading, saving) => loading || saving
);

export const selectSaleDataIsBusy = createSelector(
    selectSaleDataLoading,
    selectSaleDataSaving,
    (loading, saving) => loading || saving
);

export const selectBillingDataIsBusy = createSelector(
    selectBillingDataLoading,
    selectBillingDataSaving,
    (loading, saving) => loading || saving
);

export const selectContactsDataIsBusy = createSelector(
    selectContactsDataLoading,
    selectContactsDataSaving,
    (loading, saving) => loading || saving
);

export const selectIneDataIsBusy = createSelector(
    selectIneDataLoading,
    selectIneDataSaving,
    (loading, saving) => loading || saving
);

export const selectCreditRequestDataIsBusy = createSelector(
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    (loading, saving) => loading || saving
);

// Combined section selector by name
export const selectSectionData = (section: CustomerFormSection) => createSelector(
    selectCustomerState,
    (state) => {
        switch (section) {
            case 'generalData': return state.generalData;
            case 'contractData': return state.contractData;
            case 'commissionData': return state.commissionData;
            case 'saleData': return state.saleData;
            case 'billingData': return state.billingData;
            case 'contactsData': return state.contactsData;
            case 'ineData': return state.ineData;
            case 'creditRequestData': return state.creditRequestData;
            default: return null;
        }
    }
);
