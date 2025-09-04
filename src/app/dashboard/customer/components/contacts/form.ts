// Formulario de Contacto — discriminantes estrictos
import { TextFieldType, TextFieldInterface } from "@/components/text-field/text-field.component";
import { SelectFieldInterface } from "@/components/select/select.component";

/** ----------------------------------------------------------------
 *  Discriminantes estrictos (sin modificar las interfaces originales)
 *  ---------------------------------------------------------------- */
type TextFieldStrict = Omit<TextFieldInterface, 'control'> & { control: 'text' };
type SelectFieldStrict = Omit<SelectFieldInterface, 'control'> & { control: 'select' };

/** -------------------------
 *  Claves por tipo de campo
 *  ------------------------- */
export type ContactDataKeys = 'name' | 'position' | 'phone' | 'email';

export type ContactSelectKeys = never;
export type ContactTextKeys = ContactDataKeys;

/** ------------------------------------
 *  Forma tipada final del formulario
 *  ------------------------------------ */
export type ContactForm =
    & Record<ContactTextKeys, TextFieldStrict>
    & Record<ContactSelectKeys, SelectFieldStrict>;

/** ---------------------------------------
 *  Objeto de configuración del formulario
 *  --------------------------------------- */
export const contactForm: ContactForm = {
    name: {
        id: 'name',
        label: 'Nombre',
        formControlName: 'name',
        placeholder: 'Nombre del contacto',
        control: 'text',
        type: 'text',
    },
    position: {
        id: 'position',
        label: 'Puesto',
        formControlName: 'position',
        placeholder: 'Puesto del contacto',
        control: 'text',
        type: 'text',
    },
    phone: {
        id: 'phone',
        label: 'Teléfono',
        formControlName: 'phone',
        placeholder: 'Teléfono del contacto',
        control: 'text',
        type: 'tel', // si tu TextFieldType no tiene 'tel', deja 'text'
        // mask: 'phone' as any,
    },
    email: {
        id: 'email',
        label: 'Correo Electrónico',
        formControlName: 'email',
        placeholder: 'Correo electrónico del contacto',
        control: 'text',
        type: 'email', // valida formato email si tu componente lo soporta
    },
};

/** ---------------------------------------
 *  (Opcional) Utilidades derivadas
 *  ---------------------------------------
 *  export type ContactField = ContactForm[ContactDataKeys];
 *  export const contactOrder: ContactDataKeys[] = ['name','position','phone','email'];
 */
