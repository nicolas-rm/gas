// Interfaces, constantes y types del formulario de Datos Generales
import { TextFieldType, TextFieldInterface } from "@/components/text-field/text-field.component";
import { SelectOption, SelectFieldInterface } from "@/components/select/select.component";

/** ----------------------------------------------------------------
 *  Discriminantes estrictos (sin modificar las interfaces originales)
 *  ---------------------------------------------------------------- */
type TextFieldStrict = Omit<TextFieldInterface, 'control'> & { control: 'text' };
type SelectFieldStrict = Omit<SelectFieldInterface, 'control'> & { control: 'select' };

/** -------------------------
 *  Claves por tipo de campo
 *  ------------------------- */
export type GeneralDataKeys =
    | 'personType' | 'groupType' | 'rfc' | 'businessName' | 'tradeName'
    | 'street' | 'exteriorNumber' | 'interiorNumber' | 'crossing'
    | 'country' | 'state' | 'colony' | 'municipality' | 'postalCode'
    | 'phone' | 'city' | 'fax';

export type GeneralDataSelectKeys = 'personType' | 'groupType';

export type GeneralDataTextKeys = Exclude<GeneralDataKeys, GeneralDataSelectKeys>;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type GeneralDataForm =
    & Record<GeneralDataTextKeys, TextFieldStrict>
    & Record<GeneralDataSelectKeys, SelectFieldStrict>;

/** -------------------------
 *  (Opcional) catálogos
 *  ------------------------- */
const personTypeOptions: SelectOption[] = [
    // Opciones provistas dinámicamente desde el componente
];

// Define los grupos reales de tu negocio
const groupTypeOptions: SelectOption[] = [
    // Opciones provistas dinámicamente desde el componente o futuras
];

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const generalDataForm: GeneralDataForm = {
    // SELECTS
    personType: {
        id: 'personType',
        label: 'Tipo de Persona',
        formControlName: 'personType',
        placeholder: 'Tipo de Persona',
        control: 'select',
        options: personTypeOptions,
    },
    groupType: {
        id: 'groupType',
        label: 'Tipo de Grupo',
        formControlName: 'groupType',
        placeholder: 'Tipo de Grupo',
        control: 'select',
        options: groupTypeOptions,
    },

    // TEXTOS
    rfc: {
        id: 'rfc',
        label: 'RFC',
        formControlName: 'rfc',
        placeholder: 'RFC',
        control: 'text',
        type: 'text', // puedes aplicar máscara/validador RFC
    },
    businessName: {
        id: 'businessName',
        label: 'Razón Social',
        formControlName: 'businessName',
        placeholder: 'Razón Social',
        control: 'text',
        type: 'text',
    },
    tradeName: {
        id: 'tradeName',
        label: 'Nombre Comercial',
        formControlName: 'tradeName',
        placeholder: 'Nombre Comercial',
        control: 'text',
        type: 'text',
    },
    street: {
        id: 'street',
        label: 'Calle',
        formControlName: 'street',
        placeholder: 'Calle',
        control: 'text',
        type: 'text',
    },
    exteriorNumber: {
        id: 'exteriorNumber',
        label: 'Número Exterior',
        formControlName: 'exteriorNumber',
        placeholder: 'Número Exterior',
        control: 'text',
        type: 'text', // puede ser alfanumérico (12B)
    },
    interiorNumber: {
        id: 'interiorNumber',
        label: 'Número Interior',
        formControlName: 'interiorNumber',
        placeholder: 'Número Interior',
        control: 'text',
        type: 'text',
    },
    crossing: {
        id: 'crossing',
        label: 'Cruce',
        formControlName: 'crossing',
        placeholder: 'Cruce',
        control: 'text',
        type: 'text',
    },
    country: {
        id: 'country',
        label: 'País',
        formControlName: 'country',
        placeholder: 'País',
        control: 'text',
        type: 'text', // si vas a usar catálogo, conviértelo a 'select'
    },
    state: {
        id: 'state',
        label: 'Estado',
        formControlName: 'state',
        placeholder: 'Estado',
        control: 'text', // opcionalmente 'select' con catálogo de estados
        type: 'text',
    },
    colony: {
        id: 'colony',
        label: 'Colonia',
        formControlName: 'colony',
        placeholder: 'Colonia',
        control: 'text',
        type: 'text',
    },
    municipality: {
        id: 'municipality',
        label: 'Municipio',
        formControlName: 'municipality',
        placeholder: 'Municipio',
        control: 'text',
        type: 'text',
    },
    postalCode: {
        id: 'postalCode',
        label: 'Código Postal',
        formControlName: 'postalCode',
        placeholder: 'Código Postal',
        control: 'text',
        type: 'text', // mantener text para preservar ceros a la izquierda (ej. 01000)
    },
    phone: {
        id: 'phone',
        label: 'Teléfono',
        formControlName: 'phone',
        placeholder: 'Teléfono',
        control: 'text',
        type: 'text', // si tu TextFieldType soporta 'tel', puedes usarlo
    },
    city: {
        id: 'city',
        label: 'Ciudad',
        formControlName: 'city',
        placeholder: 'Ciudad',
        control: 'text',
        type: 'text',
    },
    fax: {
        id: 'fax',
        label: 'Fax',
        formControlName: 'fax',
        placeholder: 'Fax',
        control: 'text',
        type: 'text',
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type GeneralDataField = GeneralDataForm[GeneralDataKeys];
 *  export const generalDataOrder: GeneralDataKeys[] = [
 *    'personType','groupType','rfc','businessName','tradeName',
 *    'street','exteriorNumber','interiorNumber','crossing','country',
 *    'state','colony','municipality','postalCode','phone','city','fax'
 *  ];
 */
