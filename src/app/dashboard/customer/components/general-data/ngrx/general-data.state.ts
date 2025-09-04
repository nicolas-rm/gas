import { GeneralData } from './general-data.models';

export type GeneralDataStatus =
    | 'idle'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'error';

export interface GeneralDataState {
    // Datos del formulario
    data: GeneralData;

    // Estado de la operación
    status: GeneralDataStatus;
    loading: boolean;
    saving: boolean;

    // Errores
    error: string | null;

    // Metadatos
    lastSaved: number | null;
    hasUnsavedChanges: boolean;
    isDirty: boolean;
}

export const initialGeneralDataState: GeneralDataState = {
    data: {
        personType: null,
        groupType: null,
        rfc: null,
        businessName: null,
        tradeName: null,
        street: null,
        exteriorNumber: null,
        interiorNumber: null,
        crossing: null,
        country: null,
        state: null,
        colony: null,
        municipality: null,
        postalCode: null,
        phone: null,
        city: null,
        fax: null
    },
    status: 'idle',
    loading: false,
    saving: false,
    error: null,
    lastSaved: null,
    hasUnsavedChanges: false,
    isDirty: false
};
