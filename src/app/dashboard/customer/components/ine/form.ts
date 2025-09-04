// Interfaces, constantes y types del formulario INE

import { TextFieldType, TextFieldInterface } from "@/components/text-field/text-field.component";
import { SelectFieldInterface } from "@/components/select/select.component";
import { FileInputFieldInterface } from "@/components/file-input/file-input.component";

/** ----------------------------------------------------------------
 *  Discriminantes estrictos (sin modificar las interfaces originales)
 *  ---------------------------------------------------------------- */
type TextFieldStrict = Omit<TextFieldInterface, 'control'> & { control: 'text' };
type SelectFieldStrict = Omit<SelectFieldInterface, 'control'> & { control: 'select' };
type FileFieldStrict = Omit<FileInputFieldInterface, 'control'> & { control: 'file' };

/** -------------------------
 *  Claves por tipo de campo
 *  ------------------------- */
export type IneTextKeys = 'accountingKey';
export type IneSelectKeys = 'processType' | 'committeeType' | 'scope';
export type IneFileKeys = 'document';
export type IneDataKeys = IneTextKeys | IneSelectKeys | IneFileKeys;

/** ------------------------------------
 *  Forma tipada final del formulario INE
 *  ------------------------------------ */
export type IneForm =
    & Record<IneTextKeys, TextFieldStrict>
    & Record<IneSelectKeys, SelectFieldStrict>
    & Record<IneFileKeys, FileFieldStrict>;

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const ineForm: IneForm = {
    accountingKey: {
        id: 'accountingKey',
        label: 'Clave de Contabilidad',
        formControlName: 'accountingKey',
        placeholder: 'Clave de contabilidad',
        control: 'text',
        type: 'text', // requerido por tu TextFieldInterface
        // maskType: 'none', // opcional si usas máscaras
    },

    processType: {
        id: 'processType',
        label: 'Tipo de Proceso',
        formControlName: 'processType',
        placeholder: 'Seleccione el tipo de proceso',
        control: 'select',
        // options: [] // agrega catálogo cuando lo tengas
    },

    committeeType: {
        id: 'committeeType',
        label: 'Tipo de Comité',
        formControlName: 'committeeType',
        placeholder: 'Seleccione el tipo de comité',
        control: 'select',
        // options: []
    },

    scope: {
        id: 'scope',
        label: 'Ámbito',
        formControlName: 'scope',
        placeholder: 'Seleccione el ámbito',
        control: 'select',
        // options: []
    },

    document: {
        id: 'document',
        label: 'Documento',
        formControlName: 'document',
        control: 'file',
        accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
        maxSizeMB: 5,
        multiple: false
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type IneField = IneForm[IneDataKeys];
 *  export const ineOrder: IneDataKeys[] = ['accountingKey','processType','committeeType','scope','document'];
 */
