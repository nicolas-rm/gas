import { TextFieldType, TextFieldInterface } from "@/components/text-field/text-field.component";

type LoginFieldKeys = 'email' | 'password' | 'username';

type Section<T extends LoginFieldKeys> = Record<T, TextFieldInterface>;

export interface AuthenticationForm {
    signIn: Section<'email' | 'password'>;  // requerido
    signUp?: Section<'username' | 'email' | 'password'>; // opcional
    resetPassword?: Section<'email'>; // opcional
};

export const authentication: AuthenticationForm = {
    signIn: {
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
    },    
};
