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

// Customer
import * as CustomerEffects from '@/dashboard/customer/ngrx/customer.effects';
import { customerReducer } from '@/dashboard/customer/ngrx/customer.reducer';

export const ngrxProviders = [
    // Effects
    provideEffects(authenticationEffects, CustomerEffects),
    
    // States
    provideState('authentication', authenticationReducer),
    provideState('customer', customerReducer),
    
    // Router
    provideRouterStore(),
    
    // Store
    provideStore({}, { metaReducers }),
    
    // DevTools
    provideStoreDevtools({ maxAge: 100 }),
    
    // Router Serializer
    { provide: RouterStateSerializer, useClass: CustomRouterSerializer }
];
