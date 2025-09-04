// Interfaces y componentes base
import { TextFieldInterface } from "@/components/text-field/text-field.component";
import { SelectFieldInterface } from "@/components/select/select.component";
import { FileInputFieldInterface } from "@/components/file-input/file-input.component";

/* ---------------------------------------------------------
 * Discriminantes estrictos (sin tocar las interfaces base)
 * --------------------------------------------------------- */
type TextFieldStrict = Omit<TextFieldInterface, "control"> & { control: "text" };
type SelectFieldStrict = Omit<SelectFieldInterface, "control"> & { control: "select" };
type FileFieldStrict = Omit<FileInputFieldInterface, "control"> & { control: "file" };

/* ------------------------------------------
 * Claves y tipos — Credit Request (principal)
 * ------------------------------------------ */
export type CreditRequestTextKeys = "legalRepresentative" | "documentsReceiver";
export type CreditRequestFileKeys = "creditApplicationDocument";
export type CreditRequestSelectKeys = never;

export type CreditRequestDataKeys =
    | CreditRequestTextKeys
    | CreditRequestFileKeys
    | CreditRequestSelectKeys;

export type CreditRequestForm =
    & Record<CreditRequestTextKeys, TextFieldStrict>
    & Record<CreditRequestFileKeys, FileFieldStrict>
    & Record<CreditRequestSelectKeys, SelectFieldStrict>;

/* -------------------------------
 * Claves y tipos — Reference form
 * ------------------------------- */
export type ReferenceTextKeys = "name" | "position" | "phone" | "email";
export type ReferenceSelectKeys = never;

export type ReferenceDataKeys =
    | ReferenceTextKeys
    | ReferenceSelectKeys;

export type ReferenceForm =
    & Record<ReferenceTextKeys, TextFieldStrict>
    & Record<ReferenceSelectKeys, SelectFieldStrict>;

/* --------------------------
 * Registro de formularios
 * -------------------------- */
export type FormRegistry = {
    creditRequest: CreditRequestForm;
    reference: ReferenceForm;
};

/* --------------------------
 * Objeto único con formularios
 * -------------------------- */
export const creditRequestForm: FormRegistry = {
    creditRequest: {
        legalRepresentative: {
            id: "legalRepresentative",
            label: "Representante Legal",
            formControlName: "legalRepresentative",
            placeholder: "Nombre del representante legal",
            control: "text",
            type: "text",
        },
        documentsReceiver: {
            id: "documentsReceiver",
            label: "Recibe Documentos",
            formControlName: "documentsReceiver",
            placeholder: "Quién recibe",
            control: "text",
            type: "text",
        },
        creditApplicationDocument: {
            id: "creditApplicationDocument",
            label: "Documento de Solicitud de Crédito",
            formControlName: "creditApplicationDocument",
            control: "file",
            accept: ".pdf,.doc,.docx",
            maxSizeMB: 10,
            multiple: false,
        },
    },

    reference: {
        name: {
            id: "name",
            label: "Nombre",
            formControlName: "name",
            placeholder: "Nombre de la referencia",
            control: "text",
            type: "text",
        },
        position: {
            id: "position",
            label: "Puesto",
            formControlName: "position",
            placeholder: "Puesto de la referencia",
            control: "text",
            type: "text",
        },
        phone: {
            id: "phone",
            label: "Teléfono",
            formControlName: "phone",
            placeholder: "Teléfono de la referencia",
            control: "text",
            type: "tel",
            // maskType: "tel", // si usas máscaras en tu TextField
        },
        email: {
            id: "email",
            label: "Correo Electrónico",
            formControlName: "email",
            placeholder: "Correo electrónico de la referencia",
            control: "text",
            type: "email",
        },
    },
};

/* --------------------------
 * (Opcional) Utilidades
 * -------------------------- */
// export type FormKey = keyof FormRegistry; // "creditRequest" | "reference"
// export const order: Record<FormKey, string[]> = {
//   creditRequest: ["legalRepresentative","documentsReceiver","creditApplicationDocument"],
//   reference: ["name","position","phone","email"],
// };
