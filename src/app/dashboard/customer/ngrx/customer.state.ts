import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { 
  ICustomer, 
  ICustomerError, 
  CustomerFormSection,
  SaveFormRequest,
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
 * Estados permitidos para las operaciones de customer
 */
export type CustomerStatus =
  | 'idle'
  | 'loading'
  | 'saving'
  | 'saved'
  | 'error';

/**
 * Claves para identificar diferentes operaciones de carga
 */
export type CustomerLoadingKey = 
  | CustomerFormSection 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'load'
  | 'general';

/**
 * Adapter para manejar la colección de customers como entidades
 */
export const customerAdapter = createEntityAdapter<ICustomer>({
  selectId: (customer: ICustomer) => customer.id!,
  sortComparer: (a: ICustomer, b: ICustomer) => 
    (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
});

/**
 * Estado inicial para el adapter
 */
const initialEntityState = customerAdapter.getInitialState();

/**
 * Estado global de customer para NgRx
 * Extiende EntityState para aprovechar las utilidades de @ngrx/entity
 */
export interface CustomerState extends EntityState<ICustomer> {
  // Estado general del flujo
  status: CustomerStatus;

  // Indica si una acción está en curso
  loading: boolean;

  // Loading específico por sección de formulario
  sectionLoading: Record<CustomerFormSection, boolean>;

  // Mensaje de error en caso de fallo
  error: string | null;

  // Errores específicos por sección
  sectionErrors: Record<CustomerFormSection, string | null>;

  // Customer actualmente seleccionado/editando
  currentCustomer: ICustomer | null;

  // ID del customer actual
  currentCustomerId: string | null;

  // Indica qué sección se guardó exitosamente
  lastSavedSection: CustomerFormSection | null;

  // Timestamp de la última actualización
  lastUpdated: number | null;

  // Indica si hay cambios sin guardar
  hasUnsavedChanges: boolean;

  // Sección activa en el formulario
  activeSection: CustomerFormSection | null;
}

/**
 * Estado inicial del customer
 */
export const initialCustomerState: CustomerState = {
  ...initialEntityState,
  status: 'idle',
  loading: false,
  sectionLoading: {
    generalData: false,
    contractData: false,
    commissionData: false,
    saleData: false,
    billingData: false,
    contacts: false,
    ineData: false,
    creditRequestData: false
  },
  error: null,
  sectionErrors: {
    generalData: null,
    contractData: null,
    commissionData: null,
    saleData: null,
    billingData: null,
    contacts: null,
    ineData: null,
    creditRequestData: null
  },
  currentCustomer: null,
  currentCustomerId: null,
  lastSavedSection: null,
  lastUpdated: null,
  hasUnsavedChanges: false,
  activeSection: null
};

// Re-exportar tipos necesarios
export type {
  ICustomer,
  ICustomerError,
  ICustomerResponse,
  CustomerFormSection,
  SaveFormRequest,
  GeneralData,
  ContractData,
  CommissionData,
  SaleData,
  BillingData,
  ContactData,
  IneData,
  CreditRequestData
} from '@/app/dashboard/customer/ngrx/customer.models';
