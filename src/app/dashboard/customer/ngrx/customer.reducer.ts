import { createReducer, on } from '@ngrx/store';
import {
    CustomerState,
    initialCustomerState,
    customerAdapter
} from './customer.state';
import { CustomerPageActions, CustomerApiActions } from './customer.actions';
import { ICustomer } from './customer.models';

/**
 * Reducer para el estado de Customer
 */
export const customerReducer = createReducer(
    initialCustomerState,

    // ===== LOAD CUSTOMER =====
    on(CustomerPageActions.loadCustomer, (state, { customerId }) => ({
        ...state,
        loading: true,
        error: null,
        currentCustomerId: customerId
    })),

    on(CustomerApiActions.loadCustomerSuccess, (state, { customer }) =>
        customerAdapter.upsertOne(customer, {
            ...state,
            loading: false,
            error: null,
            currentCustomer: customer,
            currentCustomerId: customer.id!,
            lastUpdated: Date.now()
        })
    ),

    on(CustomerApiActions.loadCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== LOAD CUSTOMERS LIST =====
    on(CustomerPageActions.loadCustomersList, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CustomerApiActions.loadCustomersListSuccess, (state, { customers }) =>
        customerAdapter.setAll(customers, {
            ...state,
            loading: false,
            error: null,
            lastUpdated: Date.now()
        })
    ),

    on(CustomerApiActions.loadCustomersListFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== CREATE CUSTOMER =====
    on(CustomerPageActions.createCustomer, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CustomerApiActions.createCustomerSuccess, (state, { customer }) =>
        customerAdapter.addOne(customer, {
            ...state,
            loading: false,
            error: null,
            currentCustomer: customer,
            currentCustomerId: customer.id!,
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        })
    ),

    on(CustomerApiActions.createCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== UPDATE CUSTOMER =====
    on(CustomerPageActions.updateCustomer, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CustomerApiActions.updateCustomerSuccess, (state, { customer }) =>
        customerAdapter.updateOne(
            { id: customer.id!, changes: customer },
            {
                ...state,
                loading: false,
                error: null,
                currentCustomer: customer,
                hasUnsavedChanges: false,
                lastUpdated: Date.now()
            }
        )
    ),

    on(CustomerApiActions.updateCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== DELETE CUSTOMER =====
    on(CustomerPageActions.deleteCustomer, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CustomerApiActions.deleteCustomerSuccess, (state, { customerId }) => {
        const newState = customerAdapter.removeOne(customerId, {
            ...state,
            loading: false,
            error: null,
            lastUpdated: Date.now()
        });

        // Si el customer eliminado era el actual, limpiarlo
        if (state.currentCustomerId === customerId) {
            return {
                ...newState,
                currentCustomer: null,
                currentCustomerId: null
            };
        }

        return newState;
    }),

    on(CustomerApiActions.deleteCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== SAVE GENERAL DATA =====
    on(CustomerPageActions.saveGeneralData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, generalData: true },
        sectionErrors: { ...state.sectionErrors, generalData: null }
    })),

    on(CustomerApiActions.saveGeneralDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, generalData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, generalData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'generalData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveGeneralDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, generalData: false },
        sectionErrors: { ...state.sectionErrors, generalData: error.message }
    })),

    // ===== SAVE CONTRACT DATA =====
    on(CustomerPageActions.saveContractData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, contractData: true },
        sectionErrors: { ...state.sectionErrors, contractData: null }
    })),

    on(CustomerApiActions.saveContractDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, contractData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, contractData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'contractData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveContractDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, contractData: false },
        sectionErrors: { ...state.sectionErrors, contractData: error.message }
    })),

    // ===== SAVE COMMISSION DATA =====
    on(CustomerPageActions.saveCommissionData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, commissionData: true },
        sectionErrors: { ...state.sectionErrors, commissionData: null }
    })),

    on(CustomerApiActions.saveCommissionDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, commissionData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, commissionData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'commissionData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveCommissionDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, commissionData: false },
        sectionErrors: { ...state.sectionErrors, commissionData: error.message }
    })),

    // ===== SAVE SALE DATA =====
    on(CustomerPageActions.saveSaleData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, saleData: true },
        sectionErrors: { ...state.sectionErrors, saleData: null }
    })),

    on(CustomerApiActions.saveSaleDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, saleData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, saleData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'saleData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveSaleDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, saleData: false },
        sectionErrors: { ...state.sectionErrors, saleData: error.message }
    })),

    // ===== SAVE BILLING DATA =====
    on(CustomerPageActions.saveBillingData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, billingData: true },
        sectionErrors: { ...state.sectionErrors, billingData: null }
    })),

    on(CustomerApiActions.saveBillingDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, billingData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, billingData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'billingData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveBillingDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, billingData: false },
        sectionErrors: { ...state.sectionErrors, billingData: error.message }
    })),

    // ===== SAVE CONTACTS =====
    on(CustomerPageActions.saveContacts, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, contacts: true },
        sectionErrors: { ...state.sectionErrors, contacts: null }
    })),

    on(CustomerApiActions.saveContactsSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, contacts: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, contacts: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'contacts',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveContactsFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, contacts: false },
        sectionErrors: { ...state.sectionErrors, contacts: error.message }
    })),

    // ===== SAVE INE DATA =====
    on(CustomerPageActions.saveIneData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, ineData: true },
        sectionErrors: { ...state.sectionErrors, ineData: null }
    })),

    on(CustomerApiActions.saveIneDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, ineData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, ineData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'ineData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveIneDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, ineData: false },
        sectionErrors: { ...state.sectionErrors, ineData: error.message }
    })),

    // ===== SAVE CREDIT REQUEST DATA =====
    on(CustomerPageActions.saveCreditRequestData, (state) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, creditRequestData: true },
        sectionErrors: { ...state.sectionErrors, creditRequestData: null }
    })),

    on(CustomerApiActions.saveCreditRequestDataSuccess, (state, { customer, data }) => {
        const updatedCustomer = state.currentCustomer
            ? { ...state.currentCustomer, creditRequestData: data }
            : customer;

        return customerAdapter.upsertOne(customer, {
            ...state,
            sectionLoading: { ...state.sectionLoading, creditRequestData: false },
            currentCustomer: updatedCustomer,
            lastSavedSection: 'creditRequestData',
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        });
    }),

    on(CustomerApiActions.saveCreditRequestDataFailure, (state, { error }) => ({
        ...state,
        sectionLoading: { ...state.sectionLoading, creditRequestData: false },
        sectionErrors: { ...state.sectionErrors, creditRequestData: error.message }
    })),

    // ===== SAVE COMPLETE CUSTOMER =====
    on(CustomerPageActions.saveCompleteCustomer, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(CustomerApiActions.saveCompleteCustomerSuccess, (state, { customer }) =>
        customerAdapter.upsertOne(customer, {
            ...state,
            loading: false,
            error: null,
            currentCustomer: customer,
            hasUnsavedChanges: false,
            lastUpdated: Date.now()
        })
    ),

    on(CustomerApiActions.saveCompleteCustomerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error.message
    })),

    // ===== GESTIÓN DE ESTADO =====
    on(CustomerPageActions.clearCustomerState, () => initialCustomerState),

    on(CustomerPageActions.clearSectionError, (state, { section }) => ({
        ...state,
        sectionErrors: { ...state.sectionErrors, [section]: null }
    })),

    on(CustomerPageActions.clearAllErrors, (state) => ({
        ...state,
        error: null,
        sectionErrors: {
            generalData: null,
            contractData: null,
            commissionData: null,
            saleData: null,
            billingData: null,
            contacts: null,
            ineData: null,
            creditRequestData: null
        }
    })),

    on(CustomerPageActions.markChangesAsSaved, (state) => ({
        ...state,
        hasUnsavedChanges: false
    })),

    on(CustomerPageActions.markHasUnsavedChanges, (state) => ({
        ...state,
        hasUnsavedChanges: true
    })),

    // ===== SELECCIONAR CUSTOMER ACTUAL =====
    on(CustomerPageActions.setCurrentCustomer, (state, { customer }) => ({
        ...state,
        currentCustomer: customer,
        currentCustomerId: customer.id || null
    })),

    on(CustomerPageActions.clearCurrentCustomer, (state) => ({
        ...state,
        currentCustomer: null,
        currentCustomerId: null,
        hasUnsavedChanges: false,
        activeSection: null
    })),

    on(CustomerPageActions.updateCurrentCustomer, (state, { updates }) => {
        if (!state.currentCustomer) return state;

        return {
            ...state,
            currentCustomer: { ...state.currentCustomer, ...updates },
            hasUnsavedChanges: true
        };
    }),

    // ===== NAVEGACIÓN ENTRE SECCIONES =====
    on(CustomerPageActions.setActiveSection, (state, { section }) => ({
        ...state,
        activeSection: section
    })),

    on(CustomerPageActions.navigateToSection, (state, { section }) => ({
        ...state,
        activeSection: section
    })),

    // ===== CONTACTOS (MANEJO ESPECIAL) =====
    on(CustomerPageActions.addContact, (state, { contact }) => {
        if (!state.currentCustomer) return state;

        const updatedContacts = [...state.currentCustomer.contacts, contact];

        return {
            ...state,
            currentCustomer: {
                ...state.currentCustomer,
                contacts: updatedContacts
            },
            hasUnsavedChanges: true
        };
    }),

    on(CustomerPageActions.updateContact, (state, { index, contact }) => {
        if (!state.currentCustomer || !state.currentCustomer.contacts[index]) {
            return state;
        }

        const updatedContacts = [...state.currentCustomer.contacts];
        updatedContacts[index] = contact;

        return {
            ...state,
            currentCustomer: {
                ...state.currentCustomer,
                contacts: updatedContacts
            },
            hasUnsavedChanges: true
        };
    }),

    on(CustomerPageActions.removeContact, (state, { index }) => {
        if (!state.currentCustomer || !state.currentCustomer.contacts[index]) {
            return state;
        }

        const updatedContacts = state.currentCustomer.contacts.filter((_, i) => i !== index);

        return {
            ...state,
            currentCustomer: {
                ...state.currentCustomer,
                contacts: updatedContacts
            },
            hasUnsavedChanges: true
        };
    })
);
