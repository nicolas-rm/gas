// ============== NgRx ==============
import { provideEffects } from '@ngrx/effects';
// import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, RouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterSerializer } from '@/utils/ngrx/custom-router.serializer';
import { metaReducers } from '@/utils/ngrx/ngrx-store-localstorage';
import { provideState, provideStore } from '@ngrx/store';
import * as authenticationEffects from '@/authentication/ngrx/authentication.effects';
import { authenticationReducer } from '@/authentication/ngrx/authentication.reducer';

export const ngrxProviders = [
    provideEffects(authenticationEffects),
    provideState('authentication', authenticationReducer),
    provideRouterStore(),
    provideStore({}, { metaReducers }),
    provideStoreDevtools({ maxAge: 100 }),
    { provide: RouterStateSerializer, useClass: CustomRouterSerializer }
];
