// Estado global del módulo customer
export type CustomerViewMode = 'edit' | 'readonly';

export interface CustomerGlobalState {
    viewMode: CustomerViewMode;
    currentCustomerId: string | null;
}

export const initialCustomerGlobalState: CustomerGlobalState = {
    viewMode: 'edit',
    currentCustomerId: null
};
