// Formulario de Comisión — discriminantes estrictos
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
export type CommissionDataKeys =
    | 'commissionClassification'
    | 'customerLevel'
    | 'normalPercentage'
    | 'earlyPaymentPercentage'
    | 'incomeAccountingAccount';

export type CommissionSelectKeys = 'commissionClassification' | 'customerLevel';
export type CommissionTextKeys = Exclude<CommissionDataKeys, CommissionSelectKeys>;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type CommissionForm =
    & Record<CommissionTextKeys, TextFieldStrict>
    & Record<CommissionSelectKeys, SelectFieldStrict>;

/** -------------------------
 *  (Opcional) Catálogos
 *  ------------------------- */
const commissionClassificationOptions: SelectOption[] = [
    { value: 'standard', label: 'Estándar' },
    { value: 'premium', label: 'Premium' },
    { value: 'custom', label: 'Personalizada' },
];

const customerLevelOptions: SelectOption[] = [
    { value: 'A', label: 'Nivel A' },
    { value: 'B', label: 'Nivel B' },
    { value: 'C', label: 'Nivel C' },
];

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const commissionForm: CommissionForm = {
    commissionClassification: {
        id: 'commissionClassification',
        label: 'Clasificación de la Comisión',
        formControlName: 'commissionClassification',
        placeholder: 'Seleccionar Clasificación',
        control: 'select',
        options: commissionClassificationOptions,
    },
    customerLevel: {
        id: 'customerLevel',
        label: 'Nivel del Cliente',
        formControlName: 'customerLevel',
        placeholder: 'Seleccionar Nivel',
        control: 'select',
        options: customerLevelOptions,
    },
    normalPercentage: {
        id: 'normalPercentage',
        label: 'Porcentaje Normal',
        formControlName: 'normalPercentage',
        placeholder: 'Porcentaje Normal (%)',
        control: 'text',
        type: 'number', // 0–100
    },
    earlyPaymentPercentage: {
        id: 'earlyPaymentPercentage',
        label: 'Porcentaje de Pronto Pago',
        formControlName: 'earlyPaymentPercentage',
        placeholder: 'Porcentaje de Pronto Pago (%)',
        control: 'text',
        type: 'number', // 0–100
    },
    incomeAccountingAccount: {
        id: 'incomeAccountingAccount',
        label: 'Cuenta Contable de Ingresos',
        formControlName: 'incomeAccountingAccount',
        placeholder: 'Cuenta Contable de Ingresos',
        control: 'text',
        type: 'text', // puede ser alfanumérico
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type CommissionField = CommissionForm[CommissionDataKeys];
 *  export const commissionOrder: CommissionDataKeys[] = [
 *    'commissionClassification','customerLevel',
 *    'normalPercentage','earlyPaymentPercentage','incomeAccountingAccount'
 *  ];
 */
