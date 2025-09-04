// Modelos específicos para General Data
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

// Request para guardar
export interface SaveGeneralDataRequest {
    customerId?: string;
    data: GeneralData;
}

// Respuesta de API
export interface GeneralDataResponse {
    success: boolean;
    data: GeneralData;
    message?: string;
}

export interface GeneralDataError {
    message: string;
    code?: string;
    field?: string;
}
