// <TextField [id]="'email'" [label]="'Correo Electrónico'" formControlName="email" placeholder="Correo" type="email" [control]="loginForm.get('email')" />
export const authentication = {
    singIn: {
        email: {
            id: 'email',
            label: 'Correo Electrónico',
            formControlName: 'email',
            placeholder: 'Correo',
            type: 'email',
            control: 'email',
        },
        password: {
            id: 'password',
            label: 'Contraseña',
            formControlName: 'password',
            placeholder: 'Contraseña',
            type: 'password',
            control: 'password',
        },
    }
}