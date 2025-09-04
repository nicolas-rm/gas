// Modelos específicos para Contacts Data
export interface ContactData {
    name: string | null;
    position: string | null;
    phone: string | null;
    email: string | null;
}

export interface ContactsData {
    contacts: ContactData[];
}

// Request para guardar
export interface SaveContactsDataRequest {
    customerId?: string;
    data: ContactsData;
}

// Respuesta de API
export interface ContactsDataResponse {
    success: boolean;
    data: ContactsData;
    message?: string;
}

export interface ContactsDataError {
    message: string;
    code?: string;
    field?: string;
}