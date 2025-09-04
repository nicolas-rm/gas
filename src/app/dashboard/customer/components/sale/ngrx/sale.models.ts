// Modelos específicos para Sale Data
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

// Request para guardar
export interface SaveSaleDataRequest {
    customerId?: string;
    data: SaleData;
}

// Respuesta de API
export interface SaleDataResponse {
    success: boolean;
    data: SaleData;
    message?: string;
}

export interface SaleDataError {
    message: string;
    code?: string;
    field?: string;
}

// Opciones para selects
export interface SaleSelectOptions {
    accountTypeOptions: Array<{ value: string; label: string }>;
    prepaidTypeOptions: Array<{ value: string; label: string }>;
    paymentMethodOptions: Array<{ value: string; label: string }>;
}