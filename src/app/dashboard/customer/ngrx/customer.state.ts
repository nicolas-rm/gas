import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ICustomer, ICustomerError } from './customer.models';

export type CustomerDataStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export interface CustomerControlState {
    hasUnsavedChanges: boolean;
    isDirty: boolean;
    lastSaved: Date | null;
    currentSection: string | null;
    isFormValid: boolean;
}

export interface CustomerEntity extends ICustomer {
    id: string;
}

export interface CustomerDataState extends EntityState<CustomerEntity> {
    // Data state
    selectedCustomerId: string | null;

    // Operational state
    status: CustomerDataStatus;
    loading: boolean;
    saving: boolean;

    // Control state
    control: CustomerControlState;

    // Error handling
    error: ICustomerError | null;

    // Metadata
    lastUpdated: Date | null;
}

export const customerAdapter: EntityAdapter<CustomerEntity> = createEntityAdapter<CustomerEntity>({
    selectId: (customer: CustomerEntity) => customer.id,
    sortComparer: (a: CustomerEntity, b: CustomerEntity) =>
        (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
});

export const initialCustomerControlState: CustomerControlState = {
    hasUnsavedChanges: false,
    isDirty: false,
    lastSaved: null,
    currentSection: null,
    isFormValid: false
};

export const initialCustomerDataState: CustomerDataState = customerAdapter.getInitialState({
    selectedCustomerId: null,
    status: 'idle',
    loading: false,
    saving: false,
    control: initialCustomerControlState,
    error: null,
    lastUpdated: null
});
