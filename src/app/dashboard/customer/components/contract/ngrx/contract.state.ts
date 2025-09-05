import { ContractData } from './contract.models';

export type ContractDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface ContractDataState {
    // Datos del formulario
    data: ContractData;
    
    // Datos originales para restablecer
    originalData: ContractData | null;

    // Estado de la operación
    status: ContractDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores generales
    error: string | null;

    // Metadatos
    lastSaved: number | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialContractDataState: ContractDataState = {
    data: {
        printName: null,
        adminFee: null,
        cardIssueFee: null,
        reportsFee: null,
        accountingAccount: null,
        cfdiUsage: null,
        type: null,
        loyalty: null,
        percentage: null,
        rfcOrderingAccount: null,
        bank: null
    },
    originalData: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    isDirty: false
};
