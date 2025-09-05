import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { 
    ICustomer, 
    ICustomerError, 
    CustomerFormSection, 
    SaveFormRequest,
    GeneralData,
    ContractData,
    CommissionData,
    SaleData,
    BillingData,
    ContactsData,
    IneData,
    CreditRequestData,
    SaveGeneralDataRequest,
    SaveContractDataRequest,
    SaveCommissionDataRequest,
    SaveSaleDataRequest,
    SaveBillingDataRequest,
    SaveContactsDataRequest,
    SaveIneDataRequest,
    SaveCreditRequestDataRequest,
    GeneralDataResponse,
    ContractDataResponse,
    CommissionDataResponse,
    SaleDataResponse,
    BillingDataResponse,
    ContactsDataResponse,
    IneDataResponse,
    CreditRequestDataResponse,
    GeneralDataError,
    ContractDataError,
    CommissionDataError,
    SaleDataError,
    BillingDataError,
    ContactsDataError,
    IneDataError,
    CreditRequestDataError
} from './customer.models';

// UI Actions - Triggered by user interactions
export const CustomerUIActions = createActionGroup({
    source: 'Customer UI',
    events: {
        // Navigation
        'Select Customer': props<{ customerId: string }>(),
        'Navigate To Section': props<{ section: CustomerFormSection }>(),
        'Clear Selection': emptyProps(),

        // Form interactions
        'Form Field Changed': props<{ section: CustomerFormSection; field: string; value: any }>(),
        'Form Submitted': props<{ section: CustomerFormSection }>(),
        'Form Reset': props<{ section: CustomerFormSection }>(),
        'Mark Form Dirty': props<{ section: CustomerFormSection }>(),
        'Mark Form Clean': props<{ section: CustomerFormSection }>(),

        // Customer operations
        'Create Customer Requested': emptyProps(),
        'Update Customer Requested': props<{ customerId: string }>(),
        'Delete Customer Requested': props<{ customerId: string }>(),
        'Save Section Requested': props<{ section: CustomerFormSection; data: any }>(),

        // Control actions
        'Reset All Changes': emptyProps(),
        'Confirm Unsaved Changes': emptyProps(),
        'Discard Changes': emptyProps()
    }
});

// API Actions - Triggered by effects for API calls
export const CustomerAPIActions = createActionGroup({
    source: 'Customer API',
    events: {
        // Load operations
        'Load Customer': props<{ customerId: string }>(),
        'Load Customer Success': props<{ customer: ICustomer }>(),
        'Load Customer Failure': props<{ error: ICustomerError }>(),

        'Load Customers': emptyProps(),
        'Load Customers Success': props<{ customers: ICustomer[] }>(),
        'Load Customers Failure': props<{ error: ICustomerError }>(),

        // Save operations
        'Save Customer': props<{ customer: ICustomer }>(),
        'Save Customer Success': props<{ customer: ICustomer }>(),
        'Save Customer Failure': props<{ error: ICustomerError }>(),

        'Save Section': props<{ request: SaveFormRequest }>(),
        'Save Section Success': props<{ section: CustomerFormSection; data: any }>(),
        'Save Section Failure': props<{ section: CustomerFormSection; error: ICustomerError }>(),

        // Create operations
        'Create Customer': props<{ customer: Partial<ICustomer> }>(),
        'Create Customer Success': props<{ customer: ICustomer }>(),
        'Create Customer Failure': props<{ error: ICustomerError }>(),

        // Update operations
        'Update Customer': props<{ customerId: string; updates: Partial<ICustomer> }>(),
        'Update Customer Success': props<{ customer: ICustomer }>(),
        'Update Customer Failure': props<{ error: ICustomerError }>(),

        // Delete operations
        'Delete Customer': props<{ customerId: string }>(),
        'Delete Customer Success': props<{ customerId: string }>(),
        'Delete Customer Failure': props<{ error: ICustomerError }>(),

        // Clear operations
        'Clear Error': emptyProps(),
        'Reset State': emptyProps()
    }
});

// Actions específicas para General Data
export const GeneralDataPageActions = createActionGroup({
    source: 'General Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: keyof GeneralData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<GeneralData> }>(),
        'Set Data': props<{ data: GeneralData }>(),
        'Save Data': props<SaveGeneralDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

export const GeneralDataApiActions = createActionGroup({
    source: 'General Data API',
    events: {
        'Load Data Success': props<{ data: GeneralData }>(),
        'Load Data Failure': props<{ error: GeneralDataError }>(),
        'Save Data Success': props<{ data: GeneralData }>(),
        'Save Data Failure': props<{ error: GeneralDataError }>(),
    }
});

// Actions específicas para Contract Data
export const ContractDataPageActions = createActionGroup({
    source: 'Contract Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: keyof ContractData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<ContractData> }>(),
        'Set Data': props<{ data: ContractData }>(),
        'Save Data': props<SaveContractDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

export const ContractDataApiActions = createActionGroup({
    source: 'Contract Data API',
    events: {
        'Load Data Success': props<{ data: ContractData }>(),
        'Load Data Failure': props<{ error: ContractDataError }>(),
        'Save Data Success': props<{ data: ContractData }>(),
        'Save Data Failure': props<{ error: ContractDataError }>(),
    }
});

// Actions específicas para Commission Data
export const CommissionDataPageActions = createActionGroup({
    source: 'Commission Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: keyof CommissionData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<CommissionData> }>(),
        'Set Data': props<{ data: CommissionData }>(),
        'Save Data': props<SaveCommissionDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

export const CommissionDataApiActions = createActionGroup({
    source: 'Commission Data API',
    events: {
        'Load Data Success': props<{ data: CommissionData }>(),
        'Load Data Failure': props<{ error: CommissionDataError }>(),
        'Save Data Success': props<{ data: CommissionData }>(),
        'Save Data Failure': props<{ error: CommissionDataError }>(),
    }
});

// Actions específicas para Sale Data
export const SaleDataPageActions = createActionGroup({
    source: 'Sale Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: keyof SaleData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<SaleData> }>(),
        'Set Data': props<{ data: SaleData }>(),
        'Save Data': props<SaveSaleDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

export const SaleDataApiActions = createActionGroup({
    source: 'Sale Data API',
    events: {
        'Load Data Success': props<{ data: SaleData }>(),
        'Load Data Failure': props<{ error: SaleDataError }>(),
        'Save Data Success': props<{ data: SaleData }>(),
        'Save Data Failure': props<{ error: SaleDataError }>(),
    }
});

// Actions específicas para Billing Data
export const BillingDataPageActions = createActionGroup({
    source: 'Billing Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: keyof BillingData; value: string | null }>(),
        'Update Multiple Fields': props<{ updates: Partial<BillingData> }>(),
        'Set Data': props<{ data: BillingData }>(),
        'Save Data': props<SaveBillingDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps(),
    }
});

export const BillingDataApiActions = createActionGroup({
    source: 'Billing Data API',
    events: {
        'Load Data Success': props<{ data: BillingData }>(),
        'Load Data Failure': props<{ error: BillingDataError }>(),
        'Save Data Success': props<{ data: BillingData }>(),
        'Save Data Failure': props<{ error: BillingDataError }>(),
    }
});

// Actions específicas para Contacts Data
export const ContactsDataPageActions = createActionGroup({
    source: 'Contacts Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: ContactsData }>(),
        'Save Data': props<SaveContactsDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

export const ContactsDataApiActions = createActionGroup({
    source: 'Contacts Data API',
    events: {
        'Load Data Success': props<{ data: ContactsData }>(),
        'Load Data Failure': props<{ error: ContactsDataError }>(),
        'Save Data Success': props<{ data: ContactsData }>(),
        'Save Data Failure': props<{ error: ContactsDataError }>()
    }
});

// Actions específicas para INE Data
export const IneDataPageActions = createActionGroup({
    source: 'Ine Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: IneData }>(),
        'Save Data': props<SaveIneDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

export const IneDataApiActions = createActionGroup({
    source: 'Ine Data API',
    events: {
        'Load Data Success': props<{ data: IneData }>(),
        'Load Data Failure': props<{ error: IneDataError }>(),
        'Save Data Success': props<{ data: IneData }>(),
        'Save Data Failure': props<{ error: IneDataError }>()
    }
});

// Actions específicas para Credit Request Data
export const CreditRequestDataPageActions = createActionGroup({
    source: 'Credit Request Data Page',
    events: {
        'Load Data': props<{ customerId: string }>(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: CreditRequestData }>(),
        'Save Data': props<SaveCreditRequestDataRequest>(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

export const CreditRequestDataApiActions = createActionGroup({
    source: 'Credit Request Data API',
    events: {
        'Load Data Success': props<{ data: CreditRequestData }>(),
        'Load Data Failure': props<{ error: CreditRequestDataError }>(),
        'Save Data Success': props<{ data: CreditRequestData }>(),
        'Save Data Failure': props<{ error: CreditRequestDataError }>()
    }
});
