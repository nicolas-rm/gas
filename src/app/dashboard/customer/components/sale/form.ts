// Interfaces, constantes y types del formulario de Venta (Sale)
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
export type SaleTextKeys =
    | 'seller'
    | 'accountNumber'
    | 'creditDays'
    | 'creditLimit'
    | 'advanceCommission'
    | 'voucherAmount';

export type SaleSelectKeys =
    | 'accountType'
    | 'prepaidType'
    | 'paymentMethod';

export type SaleDataKeys = SaleTextKeys | SaleSelectKeys;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type SaleForm =
    & Record<SaleTextKeys, TextFieldStrict>
    & Record<SaleSelectKeys, SelectFieldStrict>;

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const saleForm: SaleForm = {
    // SELECTS
    accountType: {
        id: 'accountType',
        label: 'Tipo de Cuenta',
        formControlName: 'accountType',
        placeholder: 'Seleccione el tipo de cuenta',
        control: 'select',
        // options: [] as SelectOption[]
    },
    prepaidType: {
        id: 'prepaidType',
        label: 'Tipo de Prepago',
        formControlName: 'prepaidType',
        placeholder: 'Seleccione el tipo de prepago',
        control: 'select',
        // options: [] as SelectOption[]
    },
    paymentMethod: {
        id: 'paymentMethod',
        label: 'Forma de Pago',
        formControlName: 'paymentMethod',
        placeholder: 'Seleccione la forma de pago',
        control: 'select',
        // options: [] as SelectOption[]
    },

    // TEXTOS
    seller: {
        id: 'seller',
        label: 'Vendedor',
        formControlName: 'seller',
        placeholder: 'Nombre del vendedor',
        control: 'text',
        type: 'text',
    },
    accountNumber: {
        id: 'accountNumber',
        label: 'Número de Cuenta',
        formControlName: 'accountNumber',
        placeholder: 'Número de cuenta',
        control: 'text',
        type: 'text',
    },
    creditDays: {
        id: 'creditDays',
        label: 'Días de Crédito',
        formControlName: 'creditDays',
        placeholder: 'Días de crédito',
        control: 'text',
        type: 'number',
    },
    creditLimit: {
        id: 'creditLimit',
        label: 'Límite de Crédito',
        formControlName: 'creditLimit',
        placeholder: 'Límite de crédito',
        control: 'text',
        type: 'number',
    },
    advanceCommission: {
        id: 'advanceCommission',
        label: 'Comisión Adelantada',
        formControlName: 'advanceCommission',
        placeholder: 'Comisión adelantada',
        control: 'text',
        type: 'number',
    },
    voucherAmount: {
        id: 'voucherAmount',
        label: 'Monto de Vales',
        formControlName: 'voucherAmount',
        placeholder: 'Monto de vales',
        control: 'text',
        type: 'number',
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type SaleField = SaleForm[SaleDataKeys];
 *  export const saleOrder: SaleDataKeys[] = [
 *    'accountType','seller','accountNumber','prepaidType',
 *    'creditDays','creditLimit','advanceCommission','paymentMethod','voucherAmount'
 *  ];
 */
