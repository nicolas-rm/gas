// Formulario de Contrato — discriminantes estrictos
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
export type ContractDataKeys =
    | 'printName'
    | 'adminFee'
    | 'cardIssueFee'
    | 'reportsFee'
    | 'accountingAccount'
    | 'cfdiUsage'
    | 'type'
    | 'loyalty'
    | 'percentage'
    | 'rfcOrderingAccount'
    | 'bank';

export type ContractSelectKeys = 'cfdiUsage' | 'type' | 'loyalty' | 'bank';
export type ContractTextKeys = Exclude<ContractDataKeys, ContractSelectKeys>;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type ContractForm =
    & Record<ContractTextKeys, TextFieldStrict>
    & Record<ContractSelectKeys, SelectFieldStrict>;

/** -------------------------
 *  (Opcional) catálogos
 *  ------------------------- */
// Ajusta a tu catálogo SAT vigente
const cfdiUsageOptions: SelectOption[] = [
    { value: 'G01', label: 'Adquisición de mercancías' },
    { value: 'G03', label: 'Gastos en general' },
    { value: 'I01', label: 'Construcciones' },
    { value: 'I02', label: 'Mobiliario y equipo de oficina' },
    // ...
];

const contractTypeOptions: SelectOption[] = [
    { value: 'prepago', label: 'Prepago' },
    { value: 'credito', label: 'Crédito' },
    { value: 'mixto', label: 'Mixto' },
];

const loyaltyOptions: SelectOption[] = [
    { value: 'none', label: 'Sin Programa' },
    { value: 'points', label: 'Puntos' },
    { value: 'cash', label: 'Cashback' },
];

const bankOptions: SelectOption[] = [
    { value: 'bbva', label: 'BBVA' },
    { value: 'banamex', label: 'Citibanamex' },
    { value: 'santander', label: 'Santander' },
    { value: 'hsbc', label: 'HSBC' },
    { value: 'banorte', label: 'Banorte' },
    // ...
];

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const contractForm: ContractForm = {
    // SELECTS
    cfdiUsage: {
        id: 'cfdiUsage',
        label: 'Uso de CFDI',
        formControlName: 'cfdiUsage',
        placeholder: 'Uso de CFDI',
        control: 'select',
        options: cfdiUsageOptions,
    },
    type: {
        id: 'type',
        label: 'Tipo',
        formControlName: 'type',
        placeholder: 'Tipo',
        control: 'select',
        options: contractTypeOptions,
    },
    loyalty: {
        id: 'loyalty',
        label: 'Lealtad',
        formControlName: 'loyalty',
        placeholder: 'Lealtad',
        control: 'select',
        options: loyaltyOptions,
    },
    bank: {
        id: 'bank',
        label: 'Banco',
        formControlName: 'bank',
        placeholder: 'Banco',
        control: 'select',
        options: bankOptions,
    },

    // TEXTOS
    printName: {
        id: 'printName',
        label: 'Nombre a Imprimir',
        formControlName: 'printName',
        placeholder: 'Nombre a Imprimir',
        control: 'text',
        type: 'text',
    },
    adminFee: {
        id: 'adminFee',
        label: 'Cuota por Administración',
        formControlName: 'adminFee',
        placeholder: 'Cuota por Administración',
        control: 'text',
        type: 'number', // moneda / número
        // mask: 'currency' as any,
    },
    cardIssueFee: {
        id: 'cardIssueFee',
        label: 'Cuota por Emisión de Tarjeta',
        formControlName: 'cardIssueFee',
        placeholder: 'Cuota por Emisión de Tarjeta',
        control: 'text',
        type: 'number',
    },
    reportsFee: {
        id: 'reportsFee',
        label: 'Cuota por Reportes',
        formControlName: 'reportsFee',
        placeholder: 'Cuota por Reportes',
        control: 'text',
        type: 'number',
    },
    accountingAccount: {
        id: 'accountingAccount',
        label: 'Cuenta Contable',
        formControlName: 'accountingAccount',
        placeholder: 'Cuenta Contable',
        control: 'text',
        type: 'text', // puede ser alfanumérico (ej. 5101-01)
    },
    percentage: {
        id: 'percentage',
        label: 'Porcentaje (Cuota)',
        formControlName: 'percentage',
        placeholder: 'Porcentaje (Cuota)',
        control: 'text',
        type: 'number', // 0–100
        // mask: 'percent' as any,
    },
    rfcOrderingAccount: {
        id: 'rfcOrderingAccount',
        label: 'RFC Emisor Cuenta Ordenante',
        formControlName: 'rfcOrderingAccount',
        placeholder: 'RFC Emisor Cuenta Ordenante',
        control: 'text',
        type: 'text', // puedes aplicar máscara/validator RFC
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type ContractField = ContractForm[ContractDataKeys];
 *  export const contractOrder: ContractDataKeys[] = [
 *    'printName','adminFee','cardIssueFee','reportsFee','accountingAccount',
 *    'cfdiUsage','type','loyalty','percentage','rfcOrderingAccount','bank'
 *  ];
 */
