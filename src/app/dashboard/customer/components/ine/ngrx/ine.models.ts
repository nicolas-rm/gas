// Modelos específicos para INE Data
export interface IneData {
    accountingKey: string | null;
    processType: string | null;
    committeeType: string | null;
    scope: string | null;
    document: File | null;
}

// Request para guardar
export interface SaveIneDataRequest {
    customerId?: string;
    data: IneData;
}

// Respuesta de API
export interface IneDataResponse {
    success: boolean;
    data: IneData;
    message?: string;
}

export interface IneDataError {
    message: string;
    code?: string;
    field?: string;
}

// Opciones para selects
export interface IneSelectOptions {
    processTypeOptions: Array<{ value: string; label: string }>;
    committeeTypeOptions: Array<{ value: string; label: string }>;
    scopeOptions: Array<{ value: string; label: string }>;
}