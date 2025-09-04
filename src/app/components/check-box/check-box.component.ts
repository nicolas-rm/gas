import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, AbstractControl, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente de checkbox reutilizable que implementa ControlValueAccessor
 * Soporta validaciones, diferentes estilos y sincronización con FormControl
 * Mantiene la misma funcionalidad y estructura que TextFieldComponent
 */
@Component({
    selector: 'CheckBox',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './check-box.component.html',
    styleUrl: './check-box.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckBoxComponent),
            multi: true
        }
    ]
})
export class CheckBoxComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Etiqueta del checkbox */
    @Input() label: string = '';

    /** Identificador único del checkbox */
    @Input() id: string = '';

    /** Clases CSS adicionales para el input */
    @Input() inputClass: string = '';

    /** Atributo name del input */
    @Input() name: string = '';

    /** Control de formulario reactivo asociado */
    @Input() control: AbstractControl | null = null;

    /** Indica si el campo es requerido */
    @Input() required: boolean = false;

    /** Estado interno del campo deshabilitado */
    private _disabled: boolean = false;

    /**
     * Establece el estado de deshabilitado del campo
     * Si hay un FormControl asociado, también lo deshabilita/habilita
     */
    @Input()
    set disabled(val: boolean) {
        this._disabled = val;
        if (this.formControl) {
            if (val) {
                this.formControl.disable({ emitEvent: false });
            } else {
                this.formControl.enable({ emitEvent: false });
            }
        }
    }

    /**
     * Obtiene el estado de deshabilitado del campo
     * Prioriza el estado del FormControl si existe
     */
    get disabled(): boolean {
        if (this.formControl) {
            return this.formControl.disabled;
        }
        return this._disabled;
    }

    /**
     * Obtiene el FormControl asociado si el control es de tipo FormControl
     */
    get formControl(): FormControl | null {
        return this.control instanceof FormControl ? this.control : null;
    }

    /**
     * Obtiene el valor actual del campo, priorizando el FormControl si existe
     */
    get currentValue(): boolean {
        const rawValue = this.formControl ? this.formControl.value : this.value;
        return !!rawValue; // Asegura que sea booleano
    }

    /**
     * Determina si el campo es requerido
     * Verifica tanto la propiedad required como los validadores del control
     */
    get isRequired(): boolean {
        if (this.required) return true;

        if (this.control && this.control.validator) {
            const errors = this.control.validator({ value: false } as AbstractControl);
            return errors && errors['required'];
        }

        return false;
    }

    /** Valor interno del campo */
    value: boolean = false;

    /** Subject para manejar la destrucción del componente */
    private destroy$ = new Subject<void>();

    /**
     * Inicializa el componente
     * Genera un ID único si no se proporciona
     */
    ngOnInit(): void {
        if (!this.id) {
            this.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
        }

        this.syncWithFormControl();
    }

    /**
     * Maneja los cambios en las propiedades del componente
     * Resincroniza con el FormControl si el control cambia
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['control'] && changes['control'].currentValue) {
            this.syncWithFormControl();
        }
    }

    /**
     * Limpia las suscripciones al destruir el componente
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Sincroniza el valor interno con el FormControl asociado
     * Establece el valor inicial y escucha los cambios del control
     */
    private syncWithFormControl(): void {
        if (this.formControl) {
            if (this.formControl.value !== null && this.formControl.value !== undefined) {
                this.value = !!this.formControl.value;
            }

            this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                if (this.value !== !!value) {
                    this.value = !!value;
                }
            });
        }
    }

    /** Funciones de callback para ControlValueAccessor */
    private onChange = (value: boolean) => {
        this.value = value;
    };
    private onTouched = () => {};

    /**
     * Establece el valor del campo (implementación de ControlValueAccessor)
     * Sincroniza el valor interno y el FormControl si existe
     */
    writeValue(value: any): void {
        this.value = !!value; // Asegura que sea booleano

        if (this.formControl && this.formControl.value !== this.value) {
            this.formControl.setValue(this.value, { emitEvent: false });
        }
    }

    /**
     * Registra la función que se ejecuta cuando el valor cambia
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registra la función que se ejecuta cuando el campo es tocado
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Establece el estado de deshabilitado del campo
     */
    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
    }

    /**
     * Maneja el cambio del checkbox
     * Actualiza el valor y notifica los cambios
     */
    onCheckboxChange(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        this.value = checked;

        // Notificar cambios
        this.onChange(checked);
        this.onTouched(); // Solo marcar como touched cuando hay cambio real

        // Sincronizar con FormControl si existe
        if (this.formControl && this.formControl.value !== checked) {
            this.formControl.setValue(checked, { emitEvent: false });
        }
    }

    /**
     * Obtiene los errores de validación del control asociado
     * @returns Array de mensajes de error si el control tiene errores y ha sido tocado
     */
    getErrors(): { message: string }[] {
        if (this.control && this.control.errors && this.control.touched) {
            const keys = Object.keys(this.control.errors);
            const uniqueKeys = keys.filter((v, i, self) => self.indexOf(v) === i);
            return uniqueKeys.map(error => {
                return this.control?.errors ? this.control.errors[error] : '';
            });
        }
        return [];
    }
}
