// Modelos compartidos para Customer Service
// Estos son modelos básicos para la comunicación con la API

export interface ICustomer {
    id?: string;
    name?: string;
    email?: string;
    // Agregar más campos según sea necesario
}

export interface ICustomerResponse {
    success: boolean;
    data: any; // Datos dinámicos según la sección
    message?: string;
}

export interface SaveFormRequest {
    customerId?: string;
    section: string;
    data: any; // Datos dinámicos según la sección
}

export interface ICustomerError {
    message: string;
    code?: string;
    field?: string;
}
