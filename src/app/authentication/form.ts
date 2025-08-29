import { TextFieldType } from "../components/text-field/text-field.component";

export const authentication = {
    singIn: {
        email: {
            id: 'email',
            label: 'Correo Electrónico',
            formControlName: 'email',
            placeholder: 'Correo',
            type: 'email' as TextFieldType,
            control: 'email',
        },
        password: {
            id: 'password',
            label: 'Contraseña',
            formControlName: 'password',
            placeholder: 'Contraseña',
            type: 'password' as TextFieldType,
            control: 'password',
        },
    }
}
