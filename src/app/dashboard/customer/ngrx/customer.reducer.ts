// Reducer para el estado global de customer
import { createReducer, on } from '@ngrx/store';

import { CustomerPageActions } from './customer.actions';
import { CustomerGlobalState, initialCustomerGlobalState } from './customer.state';

export const customerReducer = createReducer(
    initialCustomerGlobalState,
    on(CustomerPageActions.setViewMode, (state, { viewMode }) => ({
        ...state,
        viewMode
    })),
    on(CustomerPageActions.setCurrentCustomer, (state, { customerId }) => ({
        ...state,
        currentCustomerId: customerId
    })),
    on(CustomerPageActions.clearCurrentCustomer, (state) => ({
        ...state,
        currentCustomerId: null
    }))
);
