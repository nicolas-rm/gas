import { SaleData } from './sale.models';

export type SaleDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface SaleDataState {
    // Datos del formulario
    data: SaleData;

    // Estado de la operación
    status: SaleDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    lastSaved: number | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialSaleDataState: SaleDataState = {
    data: {
        accountType: null,
        seller: null,
        accountNumber: null,
        prepaidType: null,
        creditDays: null,
        creditLimit: null,
        advanceCommission: null,
        paymentMethod: null,
        voucherAmount: null
    },
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    isDirty: false
};