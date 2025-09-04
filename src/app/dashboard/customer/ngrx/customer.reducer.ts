import { createReducer, on } from '@ngrx/store';
import { CustomerUIActions, CustomerAPIActions } from './customer.actions';
import { CustomerDataState, initialCustomerDataState, customerAdapter } from './customer.state';

export const customerReducer = createReducer(
    initialCustomerDataState,

    // UI Actions
    on(CustomerUIActions.selectCustomer, (state, { customerId }) => ({
        ...state,
        selectedCustomerId: customerId,
        error: null
    })),

    on(CustomerUIActions.navigateToSection, (state, { section }) => ({
        ...state,
        control: {
            ...state.control,
            currentSection: section
        }
    })),

    on(CustomerUIActions.clearSelection, (state) => ({
        ...state,
        selectedCustomerId: null,
        control: {
            ...state.control,
            currentSection: null
        }
    })),

    on(CustomerUIActions.formFieldChanged, (state, { section }) => ({
        ...state,
        control: {
            ...state.control,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(CustomerUIActions.markFormDirty, (state) => ({
        ...state,
        control: {
            ...state.control,
            isDirty: true,
            hasUnsavedChanges: true
        }
    })),

    on(CustomerUIActions.markFormClean, (state) => ({
        ...state,
        control: {
            ...state.control,
            isDirty: false,
            hasUnsavedChanges: false
        }
    })),

    on(CustomerUIActions.resetAllChanges, (state) => ({
        ...state,
        control: {
            ...state.control,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    // API Actions - Loading
    on(CustomerAPIActions.loadCustomer, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null
    })),

    on(CustomerAPIActions.loadCustomerSuccess, (state, { customer }) =>
        customerAdapter.upsertOne(customer as any, {
            ...state,
            status: 'success' as const,
            loading: false,
            error: null,
            lastUpdated: new Date()
        })
    ),

    on(CustomerAPIActions.loadCustomerFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error
    })),

    on(CustomerAPIActions.loadCustomers, (state) => ({
        ...state,
        status: 'loading' as const,
        loading: true,
        error: null
    })),

    on(CustomerAPIActions.loadCustomersSuccess, (state, { customers }) =>
        customerAdapter.setAll(customers as any[], {
            ...state,
            status: 'success' as const,
            loading: false,
            error: null,
            lastUpdated: new Date()
        })
    ),

    on(CustomerAPIActions.loadCustomersFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        loading: false,
        error
    })),

    // API Actions - Saving
    on(CustomerAPIActions.saveCustomer, CustomerAPIActions.saveSection, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),

    on(CustomerAPIActions.saveCustomerSuccess, (state, { customer }) =>
        customerAdapter.upsertOne(customer as any, {
            ...state,
            status: 'success' as const,
            saving: false,
            error: null,
            lastUpdated: new Date(),
            control: {
                ...state.control,
                hasUnsavedChanges: false,
                isDirty: false,
                lastSaved: new Date()
            }
        })
    ),

    on(CustomerAPIActions.saveSectionSuccess, (state, { section, data }) => ({
        ...state,
        status: 'success' as const,
        saving: false,
        error: null,
        lastUpdated: new Date(),
        control: {
            ...state.control,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date()
        }
    })),

    on(CustomerAPIActions.saveCustomerFailure, CustomerAPIActions.saveSectionFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error
    })),

    // API Actions - Creating
    on(CustomerAPIActions.createCustomer, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),

    on(CustomerAPIActions.createCustomerSuccess, (state, { customer }) =>
        customerAdapter.addOne(customer as any, {
            ...state,
            status: 'success' as const,
            saving: false,
            selectedCustomerId: customer.id!,
            error: null,
            lastUpdated: new Date(),
            control: {
                ...state.control,
                hasUnsavedChanges: false,
                isDirty: false,
                lastSaved: new Date()
            }
        })
    ),

    on(CustomerAPIActions.createCustomerFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error
    })),

    // API Actions - Updating
    on(CustomerAPIActions.updateCustomer, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),

    on(CustomerAPIActions.updateCustomerSuccess, (state, { customer }) =>
        customerAdapter.upsertOne(customer as any, {
            ...state,
            status: 'success' as const,
            saving: false,
            error: null,
            lastUpdated: new Date(),
            control: {
                ...state.control,
                hasUnsavedChanges: false,
                isDirty: false,
                lastSaved: new Date()
            }
        })
    ),

    on(CustomerAPIActions.updateCustomerFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error
    })),

    // API Actions - Deleting
    on(CustomerAPIActions.deleteCustomer, (state) => ({
        ...state,
        status: 'saving' as const,
        saving: true,
        error: null
    })),

    on(CustomerAPIActions.deleteCustomerSuccess, (state, { customerId }) =>
        customerAdapter.removeOne(customerId, {
            ...state,
            status: 'success' as const,
            saving: false,
            selectedCustomerId: state.selectedCustomerId === customerId ? null : state.selectedCustomerId,
            error: null,
            lastUpdated: new Date()
        })
    ),

    on(CustomerAPIActions.deleteCustomerFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        saving: false,
        error
    })),

    // Utility actions
    on(CustomerAPIActions.clearError, (state) => ({
        ...state,
        error: null
    })),

    on(CustomerAPIActions.resetState, () => initialCustomerDataState)
);
