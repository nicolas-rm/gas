import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';

export interface CustomRouterState {
    url: string;
    params: Record<string, string>;
    queryParams: Record<string, string>;
}

export class CustomRouterSerializer implements RouterStateSerializer<CustomRouterState> {
    serialize(routerState: RouterStateSnapshot): CustomRouterState {
        const { url } = routerState;
        const { queryParams } = routerState.root;

        let state = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
        }

        const { params } = state;
        return { url, params, queryParams };
    }
}
