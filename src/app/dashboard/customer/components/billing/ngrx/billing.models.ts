// Modelos específicos para Billing Data
export interface BillingData {
    invoiceRepresentation: string | null;
    billingDays: string | null;
    billingEmails: string | null;
    billingFrequency: string | null;
    startDate: string | null;
    endDate: string | null;
    automaticBilling: string | null;
}

// Request para guardar
export interface SaveBillingDataRequest {
    customerId?: string;
    data: BillingData;
}

// Respuesta de API
export interface BillingDataResponse {
    success: boolean;
    data: BillingData;
    message?: string;
}

export interface BillingDataError {
    message: string;
    code?: string;
    field?: string;
}

// Opciones para selects
export interface BillingSelectOptions {
    invoiceRepresentationOptions: Array<{ value: string; label: string }>;
    billingDaysOptions: Array<{ value: string; label: string }>;
    billingFrequencyOptions: Array<{ value: string; label: string }>;
    automaticBillingOptions: Array<{ value: string; label: string }>;
}