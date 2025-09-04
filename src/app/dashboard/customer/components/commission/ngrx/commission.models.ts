// Modelos específicos para Commission Data
export interface CommissionData {
    commissionClassification: string | null;
    customerLevel: string | null;
    normalPercentage: string | null;
    earlyPaymentPercentage: string | null;
    incomeAccountingAccount: string | null;
}

export interface SaveCommissionDataRequest {
    customerId?: string;
    data: CommissionData;
}

export interface CommissionDataResponse {
    success: boolean;
    data: CommissionData;
    message?: string;
}

export interface CommissionDataError {
    message: string;
    code?: string;
    field?: string;
}
