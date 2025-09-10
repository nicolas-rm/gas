// Selectores para el estado global de customer
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CustomerGlobalState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerGlobalState>('customer');

export const selectCustomerViewMode = createSelector(
    selectCustomerState,
    (state) => state.viewMode
);

export const selectIsReadonlyMode = createSelector(
    selectCustomerViewMode,
    (viewMode) => viewMode === 'readonly'
);

export const selectCurrentCustomerId = createSelector(
    selectCustomerState,
    (state) => state.currentCustomerId
);

// Selectores para datos del cliente
export const selectCustomerData = createSelector(
    selectCustomerState,
    (state) => state.customerData
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

// Selectores para datos específicos de cada tab
export const selectGeneralData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.generalData || null
);

export const selectContactsData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.contacts || null
);

export const selectContractData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.contract || null
);

export const selectCommissionData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.commission || null
);

export const selectSaleData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.sale || null
);

export const selectBillingData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.billing || null
);

export const selectIneData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.ine || null
);

export const selectCreditRequestData = createSelector(
    selectCustomerData,
    (customerData) => customerData?.creditRequest || null
);
