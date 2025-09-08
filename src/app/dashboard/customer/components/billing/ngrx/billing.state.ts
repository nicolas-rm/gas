import { BillingData } from './billing.models';

export type BillingDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface BillingDataState {
    // Datos del formulario
    data: BillingData;
    
    // Datos originales para restablecer
    originalData: BillingData | null;

    // Estado de la operación
    status: BillingDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialBillingDataState: BillingDataState = {
    data: {
        invoiceRepresentation: null,
        billingDays: null,
        billingEmails: null,
        billingFrequency: null,
        startDate: null,
        endDate: null,
        automaticBilling: null
    },
    originalData: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false
};
