// ============== NgRx ==============
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, RouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterSerializer } from '@/utils/ngrx/custom-router.serializer';
import { metaReducers } from '@/utils/ngrx/ngrx-store-localstorage';
import { provideState, provideStore } from '@ngrx/store';

// Authentication
import * as authenticationEffects from '@/authentication/ngrx/authentication.effects';
import { authenticationReducer } from '@/authentication/ngrx/authentication.reducer';

// Customer Components NgRx
// General Data
import * as GeneralDataEffects from '@/dashboard/customer/components/general-data/ngrx/general-data.effects';
import { generalDataReducer } from '@/dashboard/customer/components/general-data/ngrx/general-data.reducer';

// Contacts  
import * as ContactsEffects from '@/dashboard/customer/components/contacts/ngrx/contacts.effects';
import { contactsDataReducer } from '@/dashboard/customer/components/contacts/ngrx/contacts.reducer';

// Credit Request
import * as CreditRequestEffects from '@/dashboard/customer/components/credit-request/ngrx/credit-request.effects';
import { creditRequestDataReducer } from '@/dashboard/customer/components/credit-request/ngrx/credit-request.reducer';

// INE
import * as IneEffects from '@/dashboard/customer/components/ine/ngrx/ine.effects';
import { ineDataReducer } from '@/dashboard/customer/components/ine/ngrx/ine.reducer';

// Sale
import * as SaleEffects from '@/dashboard/customer/components/sale/ngrx/sale.effects';
import { saleDataReducer } from '@/dashboard/customer/components/sale/ngrx/sale.reducer';

// Contract
import * as ContractEffects from '@/dashboard/customer/components/contract/ngrx/contract.effects';
import { contractDataReducer } from '@/dashboard/customer/components/contract/ngrx/contract.reducer';

// Commission
import * as CommissionEffects from '@/dashboard/customer/components/commission/ngrx/commission.effects';
import { commissionDataReducer } from '@/dashboard/customer/components/commission/ngrx/commission.reducer';

// Billing
import * as BillingEffects from '@/dashboard/customer/components/billing/ngrx/billing.effects';
import { billingDataReducer } from '@/dashboard/customer/components/billing/ngrx/billing.reducer';

export const ngrxProviders = [
    // Effects
    provideEffects(
        authenticationEffects, 
        GeneralDataEffects,
        ContactsEffects,
        CreditRequestEffects,
        IneEffects,
        SaleEffects,
        ContractEffects,
        CommissionEffects,
        BillingEffects
    ),
    
    // States
    provideState('authentication', authenticationReducer),
    provideState('generalData', generalDataReducer),
    provideState('contacts', contactsDataReducer),
    provideState('creditRequestData', creditRequestDataReducer),
    provideState('ineData', ineDataReducer),
    provideState('saleData', saleDataReducer),
    provideState('contractData', contractDataReducer),
    provideState('commissionData', commissionDataReducer),
    provideState('billingData', billingDataReducer),
    
    // Router
    provideRouterStore(),
    
    // Store
    provideStore({}, { metaReducers }),
    
    // DevTools
    provideStoreDevtools({ maxAge: 100 }),
    
    // Router Serializer
    { provide: RouterStateSerializer, useClass: CustomRouterSerializer }
];
