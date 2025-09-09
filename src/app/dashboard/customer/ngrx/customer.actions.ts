// Actions para el estado global de customer
import { createAction, props } from '@ngrx/store';

import { CustomerViewMode } from './customer.state';

export const CustomerPageActions = {
    setViewMode: createAction(
        '[Customer Page] Set View Mode',
        props<{ viewMode: CustomerViewMode }>()
    ),
    setCurrentCustomer: createAction(
        '[Customer Page] Set Current Customer',
        props<{ customerId: string }>()
    ),
    clearCurrentCustomer: createAction('[Customer Page] Clear Current Customer')
};
