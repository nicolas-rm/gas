import { createReducer, on } from '@ngrx/store';
import { 
    CustomerUIActions, 
    CustomerAPIActions,
    GeneralDataPageActions,
    GeneralDataApiActions,
    ContractDataPageActions,
    ContractDataApiActions,
    CommissionDataPageActions,
    CommissionDataApiActions,
    SaleDataPageActions,
    SaleDataApiActions,
    BillingDataPageActions,
    BillingDataApiActions,
    ContactsDataPageActions,
    ContactsDataApiActions,
    IneDataPageActions,
    IneDataApiActions,
    CreditRequestDataPageActions,
    CreditRequestDataApiActions
} from './customer.actions';
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

    on(CustomerAPIActions.resetState, () => initialCustomerDataState),

    // ========== GENERAL DATA ACTIONS ==========
    // Page actions
    on(GeneralDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data: {
                ...state.generalData.data,
                [field]: value
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(GeneralDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data: {
                ...state.generalData.data,
                ...updates
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(GeneralDataPageActions.setData, (state, { data }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(GeneralDataPageActions.saveData, (state) => ({
        ...state,
        generalData: {
            ...state.generalData,
            status: 'saving',
            saving: true,
            error: null
        }
    })),

    on(GeneralDataPageActions.resetForm, (state) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data: initialCustomerDataState.generalData.data,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        }
    })),

    on(GeneralDataPageActions.clearErrors, (state) => ({
        ...state,
        generalData: {
            ...state.generalData,
            error: null
        }
    })),

    on(GeneralDataPageActions.markAsPristine, (state) => ({
        ...state,
        generalData: {
            ...state.generalData,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(GeneralDataPageActions.markAsDirty, (state) => ({
        ...state,
        generalData: {
            ...state.generalData,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    // API actions
    on(GeneralDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data,
            status: 'saved',
            loading: false,
            error: null
        }
    })),

    on(GeneralDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            status: 'error',
            loading: false,
            error: error.message
        }
    })),

    on(GeneralDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            data,
            status: 'saved',
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date(),
            error: null
        }
    })),

    on(GeneralDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        generalData: {
            ...state.generalData,
            status: 'error',
            saving: false,
            error: error.message
        }
    })),

    // ========== CONTRACT DATA ACTIONS ==========
    // Page actions
    on(ContractDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data: {
                ...state.contractData.data,
                [field]: value
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(ContractDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data: {
                ...state.contractData.data,
                ...updates
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(ContractDataPageActions.setData, (state, { data }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(ContractDataPageActions.saveData, (state) => ({
        ...state,
        contractData: {
            ...state.contractData,
            status: 'saving',
            saving: true,
            error: null
        }
    })),

    on(ContractDataPageActions.resetForm, (state) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data: initialCustomerDataState.contractData.data,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        }
    })),

    on(ContractDataPageActions.clearErrors, (state) => ({
        ...state,
        contractData: {
            ...state.contractData,
            error: null
        }
    })),

    on(ContractDataPageActions.markAsPristine, (state) => ({
        ...state,
        contractData: {
            ...state.contractData,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(ContractDataPageActions.markAsDirty, (state) => ({
        ...state,
        contractData: {
            ...state.contractData,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    // API actions
    on(ContractDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data,
            status: 'saved',
            loading: false,
            error: null
        }
    })),

    on(ContractDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            status: 'error',
            loading: false,
            error: error.message
        }
    })),

    on(ContractDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            data,
            status: 'saved',
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date(),
            error: null
        }
    })),

    on(ContractDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        contractData: {
            ...state.contractData,
            status: 'error',
            saving: false,
            error: error.message
        }
    })),

    // ========== COMMISSION DATA ACTIONS ==========
    // Page actions
    on(CommissionDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data: {
                ...state.commissionData.data,
                [field]: value
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(CommissionDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data: {
                ...state.commissionData.data,
                ...updates
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(CommissionDataPageActions.setData, (state, { data }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(CommissionDataPageActions.saveData, (state) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            status: 'saving',
            saving: true,
            error: null
        }
    })),

    on(CommissionDataPageActions.resetForm, (state) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data: initialCustomerDataState.commissionData.data,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        }
    })),

    on(CommissionDataPageActions.clearErrors, (state) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            error: null
        }
    })),

    on(CommissionDataPageActions.markAsPristine, (state) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(CommissionDataPageActions.markAsDirty, (state) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    // API actions
    on(CommissionDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data,
            status: 'saved',
            loading: false,
            error: null
        }
    })),

    on(CommissionDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            status: 'error',
            loading: false,
            error: error.message
        }
    })),

    on(CommissionDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            data,
            status: 'saved',
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date(),
            error: null
        }
    })),

    on(CommissionDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        commissionData: {
            ...state.commissionData,
            status: 'error',
            saving: false,
            error: error.message
        }
    })),

    // ========== SALE DATA ACTIONS ==========
    // Page actions
    on(SaleDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data: {
                ...state.saleData.data,
                [field]: value
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(SaleDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data: {
                ...state.saleData.data,
                ...updates
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(SaleDataPageActions.setData, (state, { data }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(SaleDataPageActions.saveData, (state) => ({
        ...state,
        saleData: {
            ...state.saleData,
            status: 'saving',
            saving: true,
            error: null
        }
    })),

    on(SaleDataPageActions.resetForm, (state) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data: initialCustomerDataState.saleData.data,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        }
    })),

    on(SaleDataPageActions.clearErrors, (state) => ({
        ...state,
        saleData: {
            ...state.saleData,
            error: null
        }
    })),

    on(SaleDataPageActions.markAsPristine, (state) => ({
        ...state,
        saleData: {
            ...state.saleData,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(SaleDataPageActions.markAsDirty, (state) => ({
        ...state,
        saleData: {
            ...state.saleData,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    // API actions
    on(SaleDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data,
            status: 'saved',
            loading: false,
            error: null
        }
    })),

    on(SaleDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            status: 'error',
            loading: false,
            error: error.message
        }
    })),

    on(SaleDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            data,
            status: 'saved',
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date(),
            error: null
        }
    })),

    on(SaleDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        saleData: {
            ...state.saleData,
            status: 'error',
            saving: false,
            error: error.message
        }
    })),

    // ========== BILLING DATA ACTIONS ==========
    // Page actions
    on(BillingDataPageActions.updateField, (state, { field, value }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data: {
                ...state.billingData.data,
                [field]: value
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(BillingDataPageActions.updateMultipleFields, (state, { updates }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data: {
                ...state.billingData.data,
                ...updates
            },
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    on(BillingDataPageActions.setData, (state, { data }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(BillingDataPageActions.saveData, (state) => ({
        ...state,
        billingData: {
            ...state.billingData,
            status: 'saving',
            saving: true,
            error: null
        }
    })),

    on(BillingDataPageActions.resetForm, (state) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data: initialCustomerDataState.billingData.data,
            hasUnsavedChanges: false,
            isDirty: false,
            error: null
        }
    })),

    on(BillingDataPageActions.clearErrors, (state) => ({
        ...state,
        billingData: {
            ...state.billingData,
            error: null
        }
    })),

    on(BillingDataPageActions.markAsPristine, (state) => ({
        ...state,
        billingData: {
            ...state.billingData,
            hasUnsavedChanges: false,
            isDirty: false
        }
    })),

    on(BillingDataPageActions.markAsDirty, (state) => ({
        ...state,
        billingData: {
            ...state.billingData,
            hasUnsavedChanges: true,
            isDirty: true
        }
    })),

    // API actions
    on(BillingDataApiActions.loadDataSuccess, (state, { data }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data,
            status: 'saved',
            loading: false,
            error: null
        }
    })),

    on(BillingDataApiActions.loadDataFailure, (state, { error }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            status: 'error',
            loading: false,
            error: error.message
        }
    })),

    on(BillingDataApiActions.saveDataSuccess, (state, { data }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            data,
            status: 'saved',
            saving: false,
            hasUnsavedChanges: false,
            isDirty: false,
            lastSaved: new Date(),
            error: null
        }
    })),

    on(BillingDataApiActions.saveDataFailure, (state, { error }) => ({
        ...state,
        billingData: {
            ...state.billingData,
            status: 'error',
            saving: false,
            error: error.message
        }
    }))

    // NOTE: Los actions para ContactsData, IneData y CreditRequestData siguen el mismo patrón
    // Se pueden agregar de la misma manera si se necesitan
);
