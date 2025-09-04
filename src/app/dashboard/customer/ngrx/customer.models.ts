// Interfaces para los diferentes formularios de customer
export interface GeneralData {
    personType: string | null;
    groupType: string | null;
    rfc: string | null;
    businessName: string | null;
    tradeName: string | null;
    street: string | null;
    exteriorNumber: string | null;
    interiorNumber: string | null;
    crossing: string | null;
    country: string | null;
    state: string | null;
    colony: string | null;
    municipality: string | null;
    postalCode: string | null;
    phone: string | null;
    city: string | null;
    fax: string | null;
}

export interface ContractData {
    printName: string | null;
    adminFee: string | null;
    cardIssueFee: string | null;
    reportsFee: string | null;
    accountingAccount: string | null;
    cfdiUsage: string | null;
    type: string | null;
    loyalty: string | null;
    percentage: string | null;
    rfcOrderingAccount: string | null;
    bank: string | null;
}

export interface CommissionData {
    commissionClassification: string | null;
    customerLevel: string | null;
    normalPercentage: string | null;
    earlyPaymentPercentage: string | null;
    incomeAccountingAccount: string | null;
}

export interface SaleData {
    accountType: string | null;
    seller: string | null;
    accountNumber: string | null;
    prepaidType: string | null;
    creditDays: string | null;
    creditLimit: string | null;
    advanceCommission: string | null;
    paymentMethod: string | null;
    voucherAmount: string | null;
}

export interface BillingData {
    invoiceRepresentation: string | null;
    billingDays: string | null;
    billingEmails: string | null;
    billingFrequency: string | null;
    startDate: string | null;
    endDate: string | null;
    automaticBilling: string | null;
}

export interface ContactData {
    name: string | null;
    position: string | null;
    phone: string | null;
    email: string | null;
}

export interface IneData {
    accountingKey: string | null;
    processType: string | null;
    committeeType: string | null;
    scope: string | null;
    document: File | null;
}

export interface CreditRequestData {
    legalRepresentative: string | null;
    documentsReceiver: string | null;
    creditApplicationDocument: File | null;
    references: string | null;
}

// Modelo principal del customer
export interface ICustomer {
    id?: string;
    generalData: GeneralData;
    contractData: ContractData;
    commissionData: CommissionData;
    saleData: SaleData;
    billingData: BillingData;
    contacts: ContactData[];
    ineData: IneData;
    creditRequestData: CreditRequestData;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interfaces para respuestas de API
export interface ICustomerResponse {
    success: boolean;
    data: ICustomer;
    message?: string;
}

export interface ICustomerError {
    message: string;
    code?: string;
    details?: any;
}

// Tipos para las operaciones
export type CustomerFormSection =
    | 'generalData'
    | 'contractData'
    | 'commissionData'
    | 'saleData'
    | 'billingData'
    | 'contacts'
    | 'ineData'
    | 'creditRequestData';

export interface SaveFormRequest {
    section: CustomerFormSection;
    data: any;
    customerId?: string;
}
