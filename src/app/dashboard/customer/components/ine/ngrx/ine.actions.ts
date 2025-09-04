import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IneData, IneDataResponse, IneDataError, SaveIneDataRequest } from './ine.models';

// Acciones de la página/UI
export const IneDataPageActions = createActionGroup({
    source: 'Ine Data Page',
    events: {
        'Load Data': emptyProps(),
        'Update Field': props<{ field: string; value: any }>(),
        'Set Data': props<{ data: IneData }>(),
        'Save Data': emptyProps(),
        'Reset Form': emptyProps(),
        'Clear Errors': emptyProps(),
        'Mark As Pristine': emptyProps(),
        'Mark As Dirty': emptyProps()
    }
});

// Acciones de la API
export const IneDataApiActions = createActionGroup({
    source: 'Ine Data API',
    events: {
        'Load Data Success': props<{ data: IneData }>(),
        'Load Data Failure': props<{ error: IneDataError }>(),
        'Save Data Success': props<{ data: IneData }>(),
        'Save Data Failure': props<{ error: IneDataError }>()
    }
});