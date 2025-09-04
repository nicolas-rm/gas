// Modelos específicos para Contract Data
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

// Request para guardar
export interface SaveContractDataRequest {
    customerId?: string;
    data: ContractData;
}

// Respuesta de API
export interface ContractDataResponse {
    success: boolean;
    data: ContractData;
    message?: string;
}

export interface ContractDataError {
    message: string;
    code?: string;
    field?: string;
}

// Opciones para selects
export interface ContractSelectOptions {
    cfdiUsageOptions: Array<{ value: string; label: string }>;
    contractTypeOptions: Array<{ value: string; label: string }>;
    loyaltyOptions: Array<{ value: string; label: string }>;
    bankOptions: Array<{ value: string; label: string }>;
}
