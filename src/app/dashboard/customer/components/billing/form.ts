// Billing form — discriminantes estrictos + opciones
import { SelectOption } from "@/app/components/select/select.component";
import { MaskType, TextFieldType, TextFieldInterface } from "@/app/components/text-field/text-field.component";
import { SelectFieldInterface } from "@/app/components/select/select.component";

/** ----------------------------------------------------------------
 *  Discriminantes estrictos (sin modificar las interfaces originales)
 *  ---------------------------------------------------------------- */
type TextFieldStrict = Omit<TextFieldInterface, 'control'> & { control: 'text' };
type SelectFieldStrict = Omit<SelectFieldInterface, 'control'> & { control: 'select' };

/** -------------------------
 *  Claves por tipo de campo
 *  ------------------------- */
type BillingDataKeys =
    | 'invoiceRepresentation'
    | 'billingDays'
    | 'billingEmails'
    | 'billingFrequency'
    | 'startDate'
    | 'endDate'
    | 'automaticBilling';

type BillingTextKeys = 'billingEmails' | 'startDate' | 'endDate';
type BillingSelectKeys = Exclude<BillingDataKeys, BillingTextKeys>;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type BillingForm =
    & Record<BillingTextKeys, TextFieldStrict>
    & Record<BillingSelectKeys, SelectFieldStrict>;

/** -------------------------
 *  Helpers de catálogo
 *  ------------------------- */
const rangeOptions = (start: number, end: number): SelectOption[] =>
    Array.from({ length: end - start + 1 }, (_, i) => {
        const v = String(start + i);
        return { value: v, label: v };
    });

const yesNoOptions: SelectOption[] = [
    { value: 'yes', label: 'Sí' },
    { value: 'no', label: 'No' },
];

const invoiceRepresentationOptions: SelectOption[] = [
    { value: 'xml', label: 'Digital (XML)' },
    { value: 'pdf', label: 'Impreso (PDF)' },
    { value: 'pdf_xml', label: 'Ambos (PDF + XML)' },
];

const billingFrequencyOptions: SelectOption[] = [
    { value: 'daily', label: 'Diaria' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'bimonthly', label: 'Bimestral' },
    { value: 'quarterly', label: 'Trimestral' },
];

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const billingForm: BillingForm = {
    invoiceRepresentation: {
        id: 'invoiceRepresentation',
        label: 'Representación Factura',
        formControlName: 'invoiceRepresentation',
        placeholder: 'Seleccione la representación de factura',
        control: 'select',
        options: invoiceRepresentationOptions,
    },

    billingDays: {
        id: 'billingDays',
        label: 'Días de Facturación',
        formControlName: 'billingDays',
        placeholder: 'Seleccione los días de facturación',
        control: 'select',
        // multiple: true, // permite varios días (ej. 1 y 15)
        options: rangeOptions(1, 31),
    },

    billingEmails: {
        id: 'billingEmails',
        label: 'Emails de Facturación',
        formControlName: 'billingEmails',
        placeholder: 'Correos separados por coma',
        control: 'text',
        type: 'text', // si tu TextFieldType tiene 'email', puedes usar 'email'
        // mask: 'emailList' as MaskType, // si tienes una máscara definida para múltiples emails
    },

    billingFrequency: {
        id: 'billingFrequency',
        label: 'Frecuencia de Facturación',
        formControlName: 'billingFrequency',
        placeholder: 'Seleccione la frecuencia de facturación',
        control: 'select',
        options: billingFrequencyOptions,
    },

    startDate: {
        id: 'startDate',
        label: 'Fecha de Inicio',
        formControlName: 'startDate',
        placeholder: 'Seleccione la fecha de inicio',
        control: 'text',
        type: 'date',
    },

    endDate: {
        id: 'endDate',
        label: 'Fecha de Fin',
        formControlName: 'endDate',
        placeholder: 'Seleccione la fecha de fin',
        control: 'text',
        type: 'date',
    },

    automaticBilling: {
        id: 'automaticBilling',
        label: 'Facturación Automática',
        formControlName: 'automaticBilling',
        placeholder: '¿Desea facturación automática?',
        control: 'select',
        options: yesNoOptions,
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type BillingField = BillingForm[BillingDataKeys];
 *  export const billingOrder: BillingDataKeys[] = [
 *    'invoiceRepresentation','billingDays','billingEmails','billingFrequency',
 *    'startDate','endDate','automaticBilling'
 *  ];
 */
