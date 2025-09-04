import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { 
  ICustomer, 
  ICustomerError, 
  ICustomerResponse,
  SaveFormRequest, 
  CustomerFormSection,
  GeneralData,
  ContractData,
  CommissionData,
  SaleData,
  BillingData,
  ContactData,
  IneData,
  CreditRequestData
} from '@/app/dashboard/customer/ngrx/customer.models';

/**
 * Acciones desde la UI (Page)
 */
export const CustomerPageActions = createActionGroup({
  source: 'Customer Page',
  events: {
    // ===== OPERACIONES CRUD BÁSICAS =====
    'Load Customer': props<{ customerId: string }>(),
    'Load Customers List': props<{ 
      page?: number; 
      limit?: number; 
      filters?: any 
    }>(),
    'Create Customer': props<{ customerData: Partial<ICustomer> }>(),
    'Update Customer': props<{ 
      customerId: string; 
      customerData: Partial<ICustomer> 
    }>(),
    'Delete Customer': props<{ customerId: string }>(),

    // ===== GUARDAR SECCIONES INDIVIDUALES =====
    'Save General Data': props<{ 
      customerId?: string; 
      data: GeneralData 
    }>(),
    'Save Contract Data': props<{ 
      customerId?: string; 
      data: ContractData 
    }>(),
    'Save Commission Data': props<{ 
      customerId?: string; 
      data: CommissionData 
    }>(),
    'Save Sale Data': props<{ 
      customerId?: string; 
      data: SaleData 
    }>(),
    'Save Billing Data': props<{ 
      customerId?: string; 
      data: BillingData 
    }>(),
    'Save Contacts': props<{ 
      customerId?: string; 
      data: ContactData[] 
    }>(),
    'Save Ine Data': props<{ 
      customerId?: string; 
      data: IneData 
    }>(),
    'Save Credit Request Data': props<{ 
      customerId?: string; 
      data: CreditRequestData 
    }>(),

    // ===== GUARDAR FORMULARIO COMPLETO =====
    'Save Complete Customer': props<{ customerData: ICustomer }>(),

    // ===== GESTIÓN DE ESTADO =====
    'Clear Customer State': emptyProps(),
    'Clear Section Error': props<{ section: CustomerFormSection }>(),
    'Clear All Errors': emptyProps(),
    'Mark Changes As Saved': emptyProps(),
    'Mark Has Unsaved Changes': emptyProps(),
    
    // ===== SELECCIONAR CUSTOMER ACTUAL =====
    'Set Current Customer': props<{ customer: ICustomer }>(),
    'Clear Current Customer': emptyProps(),
    'Update Current Customer': props<{ updates: Partial<ICustomer> }>(),

    // ===== NAVEGACIÓN ENTRE SECCIONES =====
    'Set Active Section': props<{ section: CustomerFormSection }>(),
    'Navigate To Section': props<{ section: CustomerFormSection }>(),
    'Navigate To Next Section': emptyProps(),
    'Navigate To Previous Section': emptyProps(),

    // ===== CONTACTOS (MANEJO ESPECIAL) =====
    'Add Contact': props<{ contact: ContactData }>(),
    'Update Contact': props<{ index: number; contact: ContactData }>(),
    'Remove Contact': props<{ index: number }>(),
  }
});

/**
 * Acciones desde los efectos (API)
 */
export const CustomerApiActions = createActionGroup({
  source: 'Customer API',
  events: {
    // ===== LOAD CUSTOMER =====
    'Load Customer Success': props<{ customer: ICustomer }>(),
    'Load Customer Failure': props<{ error: ICustomerError }>(),

    // ===== LOAD CUSTOMERS LIST =====
    'Load Customers List Success': props<{ 
      customers: ICustomer[];
      total: number;
      page: number;
      limit: number;
    }>(),
    'Load Customers List Failure': props<{ error: ICustomerError }>(),

    // ===== CREATE CUSTOMER =====
    'Create Customer Success': props<{ customer: ICustomer }>(),
    'Create Customer Failure': props<{ error: ICustomerError }>(),

    // ===== UPDATE CUSTOMER =====
    'Update Customer Success': props<{ customer: ICustomer }>(),
    'Update Customer Failure': props<{ error: ICustomerError }>(),

    // ===== DELETE CUSTOMER =====
    'Delete Customer Success': props<{ customerId: string }>(),
    'Delete Customer Failure': props<{ error: ICustomerError }>(),

    // ===== SAVE SECTIONS =====
    'Save General Data Success': props<{ 
      customer: ICustomer;
      data: GeneralData;
    }>(),
    'Save General Data Failure': props<{ error: ICustomerError }>(),

    'Save Contract Data Success': props<{ 
      customer: ICustomer;
      data: ContractData;
    }>(),
    'Save Contract Data Failure': props<{ error: ICustomerError }>(),

    'Save Commission Data Success': props<{ 
      customer: ICustomer;
      data: CommissionData;
    }>(),
    'Save Commission Data Failure': props<{ error: ICustomerError }>(),

    'Save Sale Data Success': props<{ 
      customer: ICustomer;
      data: SaleData;
    }>(),
    'Save Sale Data Failure': props<{ error: ICustomerError }>(),

    'Save Billing Data Success': props<{ 
      customer: ICustomer;
      data: BillingData;
    }>(),
    'Save Billing Data Failure': props<{ error: ICustomerError }>(),

    'Save Contacts Success': props<{ 
      customer: ICustomer;
      data: ContactData[];
    }>(),
    'Save Contacts Failure': props<{ error: ICustomerError }>(),

    'Save Ine Data Success': props<{ 
      customer: ICustomer;
      data: IneData;
    }>(),
    'Save Ine Data Failure': props<{ error: ICustomerError }>(),

    'Save Credit Request Data Success': props<{ 
      customer: ICustomer;
      data: CreditRequestData;
    }>(),
    'Save Credit Request Data Failure': props<{ error: ICustomerError }>(),

    // ===== SAVE COMPLETE CUSTOMER =====
    'Save Complete Customer Success': props<{ customer: ICustomer }>(),
    'Save Complete Customer Failure': props<{ error: ICustomerError }>(),
  }
});
