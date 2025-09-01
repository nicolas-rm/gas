import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, AbstractControl, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';

/** Tipos de campo de texto disponibles */
export type TextFieldType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'week' | 'time' | 'color';

/** Tipos de máscaras predefinidas para el campo de texto */
export type MaskType = 'none' | 'tel' | 'curp' | 'rfc' | 'date' | 'credit-card' | 'postal-code';

/** Mapa de máscaras predefinidas con sus patrones correspondientes */
const MASKS: Record<MaskType, string | null> = {
    none: null,
    tel: '(00) 0000-0000',
    curp: 'AAAA000000AAAAAA00',
    rfc: 'AAAA000000AAA',
    date: '00/00/0000',
    'credit-card': '0000 0000 0000 0000',
    'postal-code': '00000'
};

/** Expresiones regulares para validación de máscaras */
const MASK_PATTERNS: Record<MaskType, RegExp | null> = {
    none: null,
    tel: /^\(\d{2}\)\s\d{4}-\d{4}$/,
    curp: /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/,
    rfc: /^[A-Z]{4}\d{6}[A-Z]{3}$/,
    date: /^\d{2}\/\d{2}\/\d{4}$/,
    'credit-card': /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
    'postal-code': /^\d{5}$/
};

/**
 * Componente de campo de texto reutilizable que implementa ControlValueAccessor
 * Soporta validaciones, máscaras, diferentes tipos de input y sincronización con FormControl
 */
@Component({
    selector: 'TextField',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective],
    templateUrl: './text-field.component.html',
    styleUrl: './text-field.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextFieldComponent),
            multi: true
        }
    ]
})
export class TextFieldComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Estado de visibilidad para campos de tipo password */
    public showPassword = false;

    /** Tipo de campo de entrada (text, password, email, etc.) */
    @Input() type: TextFieldType = 'text';

    /** Etiqueta del campo */
    @Input() label: string = '';

    /** Máscara personalizada para el campo */
    @Input() mask: string | null = null;

    /** Tipo de máscara predefinida */
    @Input() maskType: MaskType = 'none';

    /** Texto de placeholder */
    @Input() placeholder = '';

    /** Valor mínimo (para tipos numéricos o de fecha) */
    @Input() min: number | string | null = null;

    /** Valor máximo (para tipos numéricos o de fecha) */
    @Input() max: number | string | null = null;

    /** Incremento para tipos numéricos */
    @Input() step: number | string | null = null;

    /** Clases CSS adicionales para el input */
    @Input() inputClass = '';

    /** Atributo name del input */
    @Input() name = '';

    /** Identificador único del input */
    @Input() id = '';

    /** Control de formulario reactivo asociado */
    @Input() control: AbstractControl | null = null;

    /** Indica si el campo es requerido */
    @Input() required = false;

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
     * Para campos con máscara, devolvemos el valor tal como está para que NgxMask lo maneje
     */
    get currentValue(): any {
        const rawValue = this.formControl ? this.formControl.value : this.value;
        return rawValue || '';
    }

    /**
     * Obtiene el valor sin máscara (valor real del modelo)
     */
    get rawValue(): any {
        return this.formControl ? this.formControl.value : this.value;
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

    /** Valor visual (con máscara aplicada) */
    displayValue: string = '';

    /** Estado de focus del campo */
    isFocused: boolean = false;

    /** Subject para manejar la destrucción del componente */
    private destroy$ = new Subject<void>();

    /**
     * Inicializa el componente
     * Genera un ID único si no se proporciona y configura la máscara si es necesario
     */
    ngOnInit(): void {
        if (!this.id) {
            this.id = `input-${this.type}-${Math.random().toString(36).substr(2, 9)}`;
        }

        if (this.maskType && this.maskType !== 'none') {
            this.mask = MASKS[this.maskType] || null;
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

    /**
     * Aplica la máscara a un valor sin formato
     * @param value Valor a enmascarar
     * @returns Valor con máscara aplicada
     */
    private applyMaskToValue(value: any): string {
        if (!value || !this.mask) return value || '';

        const stringValue = String(value).replace(/[^A-Za-z0-9]/g, ''); // Limpiar caracteres especiales
        let maskedValue = '';
        let valueIndex = 0;

        for (let i = 0; i < this.mask.length && valueIndex < stringValue.length; i++) {
            const maskChar = this.mask[i];
            const valueChar = stringValue[valueIndex];

            if (maskChar === '0') {
                // Dígito numérico
                if (/\d/.test(valueChar)) {
                    maskedValue += valueChar;
                    valueIndex++;
                } else {
                    break; // No es un dígito válido
                }
            } else if (maskChar === 'A') {
                // Letra mayúscula
                maskedValue += valueChar.toUpperCase();
                valueIndex++;
            } else {
                // Carácter literal de la máscara (espacio, guión, etc.)
                maskedValue += maskChar;
                // No incrementamos valueIndex aquí porque es un carácter de formato
            }
        }

        return maskedValue;
    }

    /**
     * Extrae el valor sin máscara de un valor enmascarado
     * @param maskedValue Valor con máscara
     * @returns Valor sin máscara
     */
    private extractRawValue(maskedValue: string): string {
        if (!maskedValue || !this.mask) return maskedValue || '';

        let rawValue = '';
        let maskIndex = 0;

        for (let i = 0; i < maskedValue.length && maskIndex < this.mask.length; i++) {
            const char = maskedValue[i];
            const maskChar = this.mask[maskIndex];

            if (maskChar === '0' || maskChar === 'A') {
                // Es un carácter de datos
                rawValue += char;
                maskIndex++;
            } else if (char === maskChar) {
                // Es un carácter literal de la máscara, lo saltamos
                maskIndex++;
            } else {
                // Carácter no esperado, lo agregamos como dato
                rawValue += char;
            }
        }

        return rawValue;
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
     * Maneja el evento focus del input
     * Activa el estado de focus para mostrar la máscara
     */
    onFocus(): void {
        this.isFocused = true;
        // NO llamar onTouched() aquí - solo marcar cuando haya cambio de valor
    }

    /**
     * Maneja el evento blur del input
     * Desactiva el estado de focus para ocultar la máscara
     */
    onBlur(): void {
        this.isFocused = false;
    }

    /**
     * Obtiene la máscara a aplicar según el estado de focus
     * @returns La máscara si está en focus, cadena vacía si no
     */
    get activeMask(): string {
        return this.isFocused && this.mask ? this.mask : '';
    }
    /**
     * Maneja los cambios de valor del input
     * Actualiza el valor interno y notifica a los listeners
     */
    onValueChange(event: Event): void {
        const inputValue = (event.target as HTMLInputElement).value;
        this.value = inputValue;

        this.onChange(this.value);
        this.onTouched(); // Solo marcar como touched cuando hay cambio real

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

    /**
     * Alterna la visibilidad de la contraseña para campos de tipo password
     */
    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    /**
     * Valida si el valor actual cumple con el patrón de la máscara
     * @returns true si el valor es válido o no hay máscara, false en caso contrario
     */
    validateMask(): boolean {
        if (!this.maskType || this.maskType === 'none' || !this.value) {
            return true;
        }

        const pattern = MASK_PATTERNS[this.maskType];
        if (!pattern) return true;

        const maskedValue = this.applyMaskToValue(this.value);
        return pattern.test(maskedValue);
    }

    /**
     * Obtiene el mensaje de error específico para la máscara
     * @returns Mensaje de error o null si no hay error
     */
    getMaskError(): string | null {
        if (!this.validateMask()) {
            const maskLabels: Record<MaskType, string> = {
                none: '',
                tel: 'teléfono',
                curp: 'CURP',
                rfc: 'RFC',
                date: 'fecha',
                'credit-card': 'tarjeta de crédito',
                'postal-code': 'código postal'
            };

            return `Formato de ${maskLabels[this.maskType]} inválido`;
        }
        return null;
    }
}
