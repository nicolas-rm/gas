// Modelos específicos para Credit Request Data
export interface ReferenceData {
    name: string | null;
    position: string | null;
    phone: string | null;
    email: string | null;
}

export interface CreditRequestData {
    legalRepresentative: string | null;
    documentsReceiver: string | null;
    creditApplicationDocument: File | null;
    // Nueva sección: referencias (mínimo 1 visible en UI, no eliminable la primera)
    references: ReferenceData[];
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
