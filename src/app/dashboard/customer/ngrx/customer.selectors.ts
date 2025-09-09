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
