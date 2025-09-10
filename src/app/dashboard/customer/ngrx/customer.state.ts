// Estado global del módulo customer
import { CustomerViewMode, CustomerData } from './customer.models';

export interface CustomerGlobalState {
    viewMode: CustomerViewMode;
    currentCustomerId: string | null;
    
    // Datos del cliente completo
    customerData: CustomerData | null;
    
    // Estado de carga
    loading: boolean;
    saving: boolean;
    error: string | null;
}

export const initialCustomerGlobalState: CustomerGlobalState = {
    viewMode: 'edit',
    currentCustomerId: null,
    customerData: null,
    loading: false,
    saving: false,
    error: null
};
