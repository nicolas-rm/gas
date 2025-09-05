import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { 
    ICustomer, 
    ICustomerError,
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

export type CustomerDataStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

// Estados específicos para cada sección
export type SectionDataStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

// Constantes para los estados de sección
export const SectionStatus = {
    IDLE: 'idle' as const,
    LOADING: 'loading' as const,
    SAVING: 'saving' as const,
    SAVED: 'saved' as const,
    ERROR: 'error' as const
} satisfies Record<string, SectionDataStatus>;

export interface SectionState<T> {
    data: T;
    status: SectionDataStatus;
    loading: boolean;
    saving: boolean;
    error: string | null;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export interface CustomerControlState {
    hasUnsavedChanges: boolean;
    isDirty: boolean;
    lastSaved: Date | null;
    currentSection: CustomerFormSection | null;
    isFormValid: boolean;
}

export interface CustomerEntity extends ICustomer {
    id: string;
}

export interface CustomerDataState extends EntityState<CustomerEntity> {
    // Data state
    selectedCustomerId: string | null;

    // Operational state
    status: CustomerDataStatus;
    loading: boolean;
    saving: boolean;

    // Control state
    control: CustomerControlState;

    // Error handling
    error: ICustomerError | null;

    // Metadata
    lastUpdated: Date | null;

    // Estados específicos de cada sección
    generalData: SectionState<GeneralData>;
    contractData: SectionState<ContractData>;
    commissionData: SectionState<CommissionData>;
    saleData: SectionState<SaleData>;
    billingData: SectionState<BillingData>;
    contactsData: SectionState<ContactsData>;
    ineData: SectionState<IneData>;
    creditRequestData: SectionState<CreditRequestData>;
}

export const customerAdapter: EntityAdapter<CustomerEntity> = createEntityAdapter<CustomerEntity>({
    selectId: (customer: CustomerEntity) => customer.id,
    sortComparer: (a: CustomerEntity, b: CustomerEntity) =>
        (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
});

// Helper function para crear estado inicial de sección
function createInitialSectionState<T>(data: T): SectionState<T> {
    return {
        data,
        status: 'idle',
        loading: false,
        saving: false,
        error: null,
        lastSaved: null,
        hasUnsavedChanges: false,
        isDirty: false
    };
}

export const initialCustomerControlState: CustomerControlState = {
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null,
    currentSection: null,
    isFormValid: false
};

export const initialCustomerDataState: CustomerDataState = customerAdapter.getInitialState({
    selectedCustomerId: null,
    status: 'idle',
    loading: false,
    saving: false,
    control: initialCustomerControlState,
    error: null,
    lastUpdated: null,
    
    // Estados de cada sección
    generalData: createInitialSectionState<GeneralData>({
        personType: null,
        groupType: null,
        rfc: null,
        businessName: null,
        tradeName: null,
        street: null,
        exteriorNumber: null,
        interiorNumber: null,
        crossing: null,
        country: null,
        state: null,
        colony: null,
        municipality: null,
        postalCode: null,
        phone: null,
        city: null,
        fax: null
    }),
    
    contractData: createInitialSectionState<ContractData>({
        printName: null,
        adminFee: null,
        cardIssueFee: null,
        reportsFee: null,
        accountingAccount: null,
        cfdiUsage: null,
        type: null,
        loyalty: null,
        percentage: null,
        rfcOrderingAccount: null,
        bank: null
    }),
    
    commissionData: createInitialSectionState<CommissionData>({
        commissionClassification: null,
        customerLevel: null,
        normalPercentage: null,
        earlyPaymentPercentage: null,
        incomeAccountingAccount: null
    }),
    
    saleData: createInitialSectionState<SaleData>({
        accountType: null,
        seller: null,
        accountNumber: null,
        prepaidType: null,
        creditDays: null,
        creditLimit: null,
        advanceCommission: null,
        paymentMethod: null,
        voucherAmount: null
    }),
    
    billingData: createInitialSectionState<BillingData>({
        invoiceRepresentation: null,
        billingDays: null,
        billingEmails: null,
        billingFrequency: null,
        startDate: null,
        endDate: null,
        automaticBilling: null
    }),
    
    contactsData: createInitialSectionState<ContactsData>({
        contacts: []
    }),
    
    ineData: createInitialSectionState<IneData>({
        accountingKey: null,
        processType: null,
        committeeType: null,
        scope: null,
        document: null
    }),
    
    creditRequestData: createInitialSectionState<CreditRequestData>({
        legalRepresentative: null,
        documentsReceiver: null,
        creditApplicationDocument: null,
        references: null
    })
});
