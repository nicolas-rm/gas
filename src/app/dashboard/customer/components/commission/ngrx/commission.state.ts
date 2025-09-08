import { CommissionData } from './commission.models';

export type CommissionDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface CommissionDataState {
    data: CommissionData;
    originalData: CommissionData | null;
    status: CommissionDataStatus;
    loading: boolean;
    saving: boolean;
    error: string | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialCommissionDataState: CommissionDataState = {
    data: {
        commissionClassification: null,
        customerLevel: null,
        normalPercentage: null,
        earlyPaymentPercentage: null,
        incomeAccountingAccount: null
    },
    originalData: null,
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    hasUnsavedChanges: false,
    isDirty: false
};
