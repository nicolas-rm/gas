// Reducer para el estado global de customer
import { createReducer, on } from '@ngrx/store';

import { CustomerPageActions, CustomerApiActions } from './customer.actions';
import { CustomerGlobalState, initialCustomerGlobalState } from './customer.state';

export const customerReducer = createReducer(
    initialCustomerGlobalState,
    
    // === CONFIGURACIÓN DE VISTA ===
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
        currentCustomerId: null,
        customerData: null,
        error: null
    })),
    
    // === LOAD CUSTOMER ===
    on(CustomerPageActions.loadCustomer, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    
    on(CustomerApiActions.loadCustomerSuccess, (state, { customerData }) => ({
        ...state,
        loading: false,
        customerData,
        error: null
    })),
    
    on(CustomerApiActions.loadCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),
    
    // === RESET Y LIMPIEZA ===
    on(CustomerPageActions.clearErrors, (state) => ({
        ...state,
        error: null
    }))
);
