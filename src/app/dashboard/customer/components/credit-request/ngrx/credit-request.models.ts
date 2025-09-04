// Modelos específicos para Credit Request Data
export interface CreditRequestData {
    legalRepresentative: string | null;
    documentsReceiver: string | null;
    creditApplicationDocument: File | null;
}

// Request para guardar
export interface SaveCreditRequestDataRequest {
    customerId?: string;
    data: CreditRequestData;
}

// Respuesta de API
export interface CreditRequestDataResponse {
    success: boolean;
    data: CreditRequestData;
    message?: string;
}

export interface CreditRequestDataError {
    message: string;
    code?: string;
    field?: string;
}