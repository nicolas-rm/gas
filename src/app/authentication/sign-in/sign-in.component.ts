// Angular
import { Component, ChangeDetectionStrategy, inject, effect, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// NgRx
import { Store } from '@ngrx/store';
import { AuthPageActions } from '@/authentication/ngrx/authentication.actions';
import { 
    selectAuthLoading, 
    selectAuthError, 
    selectIsAuthenticated,
    selectAuthStatus 
} from '@/authentication/ngrx/authentication.selectors';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes internos
import { TextFieldComponent } from '@/components/components';

// Utilidades internas
import { ReactiveValidators } from '@/utils/validators/ReactiveValidators';

// Configuración / formulario
import { authentication } from '@/authentication/form';
import { CommonModule } from '@angular/common';

// Librerías externas
import { HotToastService } from '@ngxpert/hot-toast';

export type SignInFormControl = {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
};

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [TextFieldComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './sign-in.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
    // Inyecciones de dependencias
    private readonly store = inject(Store);
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    // Configuración de autenticación
    readonly authentication = authentication.signIn;

    // Estado de carga (Signal)
    isLoading = this.store.selectSignal(selectAuthLoading);

    // Estado de error (Signal)
    error = this.store.selectSignal(selectAuthError);

    // Estado de autenticación (Signal)
    isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

    // Estado general del proceso de auth (Signal)
    authStatus = this.store.selectSignal(selectAuthStatus);

    // Formulario de inicio de sesión
    loginForm: FormGroup<SignInFormControl>;

    // Constructor: inicializa el formulario con validaciones y efectos
    constructor() {
        // Inicializar formulario con validaciones tipadas
        this.loginForm = this.fb.group({
            email: ['', [ReactiveValidators.required, ReactiveValidators.email]],
            password: ['', [ReactiveValidators.required, ReactiveValidators.minLength(8)]],
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isLoading();

            this.ngZone.run(() => {
                if (busy) {
                    this.loginForm.disable({ emitEvent: false });
                } else {
                    this.loginForm.enable({ emitEvent: false });
                }
                // Forzar actualización inmediata tras cambios de estado
                this.cdr.detectChanges();
            });
        });

        // Effect para manejo de errores
        effect(() => {
            const errorMessage = this.error();
            
            this.ngZone.run(() => {
                if (errorMessage) {
                    // El toast de error ya se maneja en el effect, pero podemos agregar lógica adicional aquí
                    // Por ejemplo, focus en el primer campo con error
                    this.cdr.detectChanges();
                }
            });
        });

        // Effect para resetear el formulario tras autenticación exitosa
        effect(() => {
            const isAuth = this.isAuthenticated();
            
            this.ngZone.run(() => {
                if (isAuth) {
                    this.loginForm.reset({}, { emitEvent: false });
                    this.loginForm.markAsPristine();
                    this.loginForm.markAsUntouched();
                    this.cdr.detectChanges();
                }
            });
        });

        // Effect para manejar cambios de estado de autenticación
        effect(() => {
            const status = this.authStatus();
            
            this.ngZone.run(() => {
                // Lógica adicional basada en el estado
                switch (status) {
                    case 'authenticating':
                        // Formulario ya se deshabilita por el effect de loading
                        break;
                    case 'authenticated':
                        // Redirección se maneja en los effects de NgRx
                        break;
                    case 'error':
                        // Error ya se maneja en el effect de errores
                        break;
                    default:
                        break;
                }
                this.cdr.detectChanges();
            });
        });

        // Form value changes con debounce para futuras mejoras
        this.loginForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                // Aquí se puede agregar lógica para validación en tiempo real
                // o sincronización con el store si fuera necesario
                this.cdr.detectChanges();
            });
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.loginForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.loginForm.markAllAsTouched();
        return false;
    }

    // Verifica si el componente está ocupado (loading)
    isBusy(): boolean {
        return this.isLoading();
    }

    // Resetear formulario completamente
    resetForm(): void {
        this.loginForm.reset({}, { emitEvent: false });
        this.loginForm.markAsPristine();
        this.loginForm.markAsUntouched();
        this.cdr.detectChanges();
    }

    // Limpiar errores
    clearErrors(): void {
        // Si hay una acción para limpiar errores en el state de auth, se puede implementar aquí
        // this.store.dispatch(AuthPageActions.clearErrors());
    }

    // Habilitar/deshabilitar formulario manualmente si es necesario
    enableForm(): void {
        this.ngZone.run(() => {
            this.loginForm.enable({ emitEvent: false });
            this.cdr.detectChanges();
        });
    }

    disableForm(): void {
        this.ngZone.run(() => {
            this.loginForm.disable({ emitEvent: false });
            this.cdr.detectChanges();
        });
    }

    // Envía el formulario de login
    onSubmit(): void {
        if (!this.assertValid()) return;

        const { email, password } = this.loginForm.value;

        // Despacha la acción de login al Store
        this.store.dispatch(
            AuthPageActions.login({ email: email!, password: password! })
        );
    }
}
