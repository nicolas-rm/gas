// Modelos específicos para Customer
import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';
import { ContactsData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';
import { ContractData } from '@/dashboard/customer/components/contract/ngrx/contract.models';
import { CommissionData } from '@/dashboard/customer/components/commission/ngrx/commission.models';
import { SaleData } from '@/dashboard/customer/components/sale/ngrx/sale.models';
import { BillingData } from '@/dashboard/customer/components/billing/ngrx/billing.models';
import { IneData } from '@/dashboard/customer/components/ine/ngrx/ine.models';
import { CreditRequestData } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.models';

export type CustomerViewMode = 'edit' | 'readonly';

// Datos completos del cliente que incluyen todos los tabs
export interface CustomerData {
    id: string;
    generalData: GeneralData | null;
    contacts: ContactsData | null;
    contract: ContractData | null;
    commission: CommissionData | null;
    sale: SaleData | null;
    billing: BillingData | null;
    ine: IneData | null;
    creditRequest: CreditRequestData | null;
}

// Request para cargar datos del cliente
export interface LoadCustomerRequest {
    customerId: string;
}

// Respuesta de API
export interface CustomerDataResponse {
    success: boolean;
    data: CustomerData;
    message?: string;
}

export interface CustomerDataError {
    message: string;
    code?: string;
    field?: string;
}
