import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export interface TextAreaFieldInterface {
    id: string | number,
    label: string,
    formControlName: string,
    placeholder: string,
    control: string,
    rows?: number,
    maxLength?: number,
}

/**
 * Componente de área de texto reutilizable que implementa ControlValueAccessor
 * Soporta validaciones, diferentes configuraciones y sincronización con FormControl
 * Mantiene la misma funcionalidad que el componente TextField adaptada para textarea
 */
@Component({
    selector: 'TextAreaField',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './text-area.component.html',
    styleUrl: './text-area.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaFieldComponent),
            multi: true
        }
    ]
})
export class TextAreaFieldComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Etiqueta del campo */
    @Input() label: string = '';

    /** Texto de placeholder */
    @Input() placeholder = '';

    /** Número de filas visibles */
    @Input() rows: number = 3;

    /** Número de columnas (ancho) */
    @Input() cols: number | null = null;

    /** Longitud máxima del texto */
    @Input() maxLength: number | null = null;

    /** Longitud mínima del texto */
    @Input() minLength: number | null = null;

    /** Clases CSS adicionales para el textarea */
    @Input() inputClass = '';

    /** Atributo name del textarea */
    @Input() name = '';

    /** Identificador único del textarea */
    @Input() id: string | number = '';

    /** Control de formulario reactivo asociado */
    @Input() control: AbstractControl | null = null;

    /** Indica si el campo es requerido */
    @Input() required = false;

    /** Indica si el campo es de solo lectura */
    @Input() readonly = false;

    /** Mostrar contador de caracteres */
    @Input() showCharCount = true;

    /** Estado interno del campo deshabilitado */
    private _disabled = false;

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
    get currentValue(): any {
        const rawValue = this.formControl ? this.formControl.value : this.value;
        return rawValue || '';
    }

    /**
     * Determina si el campo es requerido
     * Verifica tanto la propiedad required como los validadores del control
     */
    get isRequired(): boolean {
        if (this.required) return true;

        if (this.control && this.control.validator) {
            const errors = this.control.validator({ value: '' } as AbstractControl);
            return errors && errors['required'];
        }

        return false;
    }

    /** Valor interno del campo */
    value: any;

    /** Estado de focus del campo */
    isFocused: boolean = false;

    /** Subject para manejar la destrucción del componente */
    private destroy$ = new Subject<void>();

    /**
     * Inicializa el componente
     * Genera un ID único si no se proporciona
     */
    ngOnInit(): void {
        if (!this.id) {
            this.id = `textarea-${Math.random().toString(36).substr(2, 9)}`;
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
                this.value = this.formControl.value;
            }

            this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                if (this.value !== value) {
                    this.value = value;
                }
            });
        }
    }

    /** Funciones de callback para ControlValueAccessor */
    private onChange = (value: any) => (this.value = value);
    private onTouched = () => {};

    /**
     * Establece el valor del campo (implementación de ControlValueAccessor)
     * Sincroniza el valor interno y el FormControl si existe
     */
    writeValue(value: any): void {
        this.value = value;

        if (this.formControl && this.formControl.value !== value) {
            this.formControl.setValue(value, { emitEvent: false });
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
     * Maneja el evento focus del textarea
     * Activa el estado de focus
     */
    onFocus(): void {
        this.isFocused = true;
        // NO llamar onTouched() aquí - solo marcar cuando haya cambio de valor
    }

    /**
     * Maneja el evento blur del textarea
     * Desactiva el estado de focus
     */
    onBlur(): void {
        this.isFocused = false;
    }

    /**
     * Maneja los cambios de valor en el textarea
     * @param event Evento del input
     */
    onValueChange(event: Event): void {
        const inputValue = (event.target as HTMLTextAreaElement).value;

        // Aplicar límite de caracteres si está definido
        let finalValue = inputValue;
        if (this.maxLength && inputValue.length > this.maxLength) {
            finalValue = inputValue.substring(0, this.maxLength);
            // Actualizar el valor en el DOM para reflejar el límite
            (event.target as HTMLTextAreaElement).value = finalValue;
        }

        // Actualizar valor interno
        this.value = finalValue;

        // Notificar cambios
        this.onChange(this.value);
        this.onTouched(); // Solo marcar como touched cuando hay cambio real

        // Sincronizar con FormControl si existe
        if (this.formControl && this.formControl.value !== this.value) {
            this.formControl.setValue(this.value, { emitEvent: false });
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
