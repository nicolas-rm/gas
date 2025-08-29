// Angular
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// NgRx
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@/authentication/ngrx/authentication.actions';
import { selectAuthLoading, selectAuthError } from '@/authentication/ngrx/authentication.selectors';

// Componentes internos
import { TextFieldComponent } from '@/components/components';

// Utilidades internas
import { ReactiveValidators } from '@/utils/validators/ReactiveValidators';

// Configuración / formulario
import { authentication } from '@/authentication/form';
import { CommonModule } from '@angular/common';

// Interfaces del formulario
export interface SignIn {
    email: string;
    password: string;
}

export type SignInFormControl = {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
};

@Component({
    selector: 'app-sign-in',
    imports: [TextFieldComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css',
})
export class SignInComponent {
    // Inyecciones de dependencias
    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);

    // Configuración de autenticación
    readonly authentication = authentication.signIn;

    // Estado de carga (Signal)
    isLoading = this.store.selectSignal(selectAuthLoading);

    // Estado de error (Signal)
    error = this.store.selectSignal(selectAuthError);

    // Formulario de inicio de sesión
    loginForm: FormGroup<SignInFormControl>;

    // Constructor: inicializa el formulario con validaciones
    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [ReactiveValidators.required, ReactiveValidators.email]],
            password: ['', [ReactiveValidators.required, ReactiveValidators.minLength(8)]],
        });
    }

    // Envía el formulario de login
    onSubmit(): void {
        if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, password } = this.loginForm.value;

        // Despacha la acción de login al Store
        this.store.dispatch(
            AuthPageActions.login({ email: email!, password: password! })
        );
    }
}
