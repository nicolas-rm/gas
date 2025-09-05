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

export interface ContactsData {
    contacts: ContactData[];
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
    contactsData: ContactsData;
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
    | 'contactsData'
    | 'ineData'
    | 'creditRequestData';

export interface SaveFormRequest {
    section: CustomerFormSection;
    data: any;
    customerId?: string;
}

// Interfaces específicas para requests de cada sección
export interface SaveGeneralDataRequest {
    customerId?: string;
    data: GeneralData;
}

export interface SaveContractDataRequest {
    customerId?: string;
    data: ContractData;
}

export interface SaveCommissionDataRequest {
    customerId?: string;
    data: CommissionData;
}

export interface SaveSaleDataRequest {
    customerId?: string;
    data: SaleData;
}

export interface SaveBillingDataRequest {
    customerId?: string;
    data: BillingData;
}

export interface SaveContactsDataRequest {
    customerId?: string;
    data: ContactsData;
}

export interface SaveIneDataRequest {
    customerId?: string;
    data: IneData;
}

export interface SaveCreditRequestDataRequest {
    customerId?: string;
    data: CreditRequestData;
}

// Interfaces para respuestas específicas de cada sección
export interface GeneralDataResponse {
    success: boolean;
    data: GeneralData;
    message?: string;
}

export interface ContractDataResponse {
    success: boolean;
    data: ContractData;
    message?: string;
}

export interface CommissionDataResponse {
    success: boolean;
    data: CommissionData;
    message?: string;
}

export interface SaleDataResponse {
    success: boolean;
    data: SaleData;
    message?: string;
}

export interface BillingDataResponse {
    success: boolean;
    data: BillingData;
    message?: string;
}

export interface ContactsDataResponse {
    success: boolean;
    data: ContactsData;
    message?: string;
}

export interface IneDataResponse {
    success: boolean;
    data: IneData;
    message?: string;
}

export interface CreditRequestDataResponse {
    success: boolean;
    data: CreditRequestData;
    message?: string;
}

// Interfaces para errores específicos
export interface GeneralDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface ContractDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface CommissionDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface SaleDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface BillingDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface ContactsDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface IneDataError {
    message: string;
    code?: string;
    field?: string;
}

export interface CreditRequestDataError {
    message: string;
    code?: string;
    field?: string;
}
