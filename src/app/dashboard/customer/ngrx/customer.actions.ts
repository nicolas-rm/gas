import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICustomer, ICustomerError, CustomerFormSection, SaveFormRequest } from './customer.models';

// UI Actions - Triggered by user interactions
export const CustomerUIActions = createActionGroup({
    source: 'Customer UI',
    events: {
        // Navigation
        'Select Customer': props<{ customerId: string }>(),
        'Navigate To Section': props<{ section: CustomerFormSection }>(),
        'Clear Selection': emptyProps(),

        // Form interactions
        'Form Field Changed': props<{ section: CustomerFormSection; field: string; value: any }>(),
        'Form Submitted': props<{ section: CustomerFormSection }>(),
        'Form Reset': props<{ section: CustomerFormSection }>(),
        'Mark Form Dirty': props<{ section: CustomerFormSection }>(),
        'Mark Form Clean': props<{ section: CustomerFormSection }>(),

        // Customer operations
        'Create Customer Requested': emptyProps(),
        'Update Customer Requested': props<{ customerId: string }>(),
        'Delete Customer Requested': props<{ customerId: string }>(),
        'Save Section Requested': props<{ section: CustomerFormSection; data: any }>(),

        // Control actions
        'Reset All Changes': emptyProps(),
        'Confirm Unsaved Changes': emptyProps(),
        'Discard Changes': emptyProps()
    }
});

// API Actions - Triggered by effects for API calls
export const CustomerAPIActions = createActionGroup({
    source: 'Customer API',
    events: {
        // Load operations
        'Load Customer': props<{ customerId: string }>(),
        'Load Customer Success': props<{ customer: ICustomer }>(),
        'Load Customer Failure': props<{ error: ICustomerError }>(),

        'Load Customers': emptyProps(),
        'Load Customers Success': props<{ customers: ICustomer[] }>(),
        'Load Customers Failure': props<{ error: ICustomerError }>(),

        // Save operations
        'Save Customer': props<{ customer: ICustomer }>(),
        'Save Customer Success': props<{ customer: ICustomer }>(),
        'Save Customer Failure': props<{ error: ICustomerError }>(),

        'Save Section': props<{ request: SaveFormRequest }>(),
        'Save Section Success': props<{ section: CustomerFormSection; data: any }>(),
        'Save Section Failure': props<{ section: CustomerFormSection; error: ICustomerError }>(),

        // Create operations
        'Create Customer': props<{ customer: Partial<ICustomer> }>(),
        'Create Customer Success': props<{ customer: ICustomer }>(),
        'Create Customer Failure': props<{ error: ICustomerError }>(),

        // Update operations
        'Update Customer': props<{ customerId: string; updates: Partial<ICustomer> }>(),
        'Update Customer Success': props<{ customer: ICustomer }>(),
        'Update Customer Failure': props<{ error: ICustomerError }>(),

        // Delete operations
        'Delete Customer': props<{ customerId: string }>(),
        'Delete Customer Success': props<{ customerId: string }>(),
        'Delete Customer Failure': props<{ error: ICustomerError }>(),

        // Clear operations
        'Clear Error': emptyProps(),
        'Reset State': emptyProps()
    }
});
