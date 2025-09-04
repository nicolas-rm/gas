import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, forwardRef, HostListener, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/** Interfaz para las opciones del componente Select */
export interface SelectOption {
    label: string;
    value: any;
}

export interface SelectFieldInterface {
    id: string | number;
    label: string;
    formControlName: string;
    placeholder: string;
    control: string;
    options?: SelectOption[];
}

/**
 * Componente de select reutilizable que implementa ControlValueAccessor
 * Soporta validaciones, filtrado, búsqueda y sincronización con FormControl
 * Mantiene la misma funcionalidad y estructura que TextFieldComponent
 */
@Component({
    selector: 'SelectField',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectFieldComponent),
            multi: true
        }
    ]
})
export class SelectFieldComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    /** Etiqueta del campo */
    @Input() label: string = '';

    /** Texto de placeholder */
    @Input() placeholder: string = '';

    /** Identificador único del campo */
    @Input() id: string | number = '';

    /** Opciones disponibles para seleccionar */
    @Input() options: SelectOption[] = [];

    /** Control de formulario reactivo asociado */
    @Input() control: AbstractControl | null = null;

    /** Clases CSS adicionales para el input */
    @Input() inputClass: string = '';

    /** Indica si el campo es requerido */
    @Input() required: boolean = false;

    /** Atributo name del input */
    @Input() name: string = '';

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
    get currentValue(): any {
        const rawValue = this.formControl ? this.formControl.value : this.selectedOption;
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

    /** Opción seleccionada actualmente */
    selectedOption: any = null;

    /** Valor mostrado en el input de búsqueda */
    inputValue: string = '';

    /** Estado de apertura del dropdown */
    isOpen: boolean = false;

    /** Estado de focus del campo */
    isFocused: boolean = false;

    /** Opciones filtradas por la búsqueda */
    filteredOptions: SelectOption[] = [];

    /** Subject para manejar la destrucción del componente */
    private destroy$ = new Subject<void>();

    /**
     * Inicializa el componente
     * Genera un ID único si no se proporciona
     */
    ngOnInit(): void {
        if (!this.id) {
            this.id = `select-${Math.random().toString(36).substr(2, 9)}`;
        }

        this.filteredOptions = this.options;
        this.syncWithFormControl();
    }

    /**
     * Maneja los cambios en las propiedades del componente
     * Resincroniza con el FormControl si el control cambia y actualiza opciones filtradas
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['control'] && changes['control'].currentValue) {
            this.syncWithFormControl();
        }

        if (changes['options'] && changes['options'].currentValue) {
            this.filteredOptions = this.options;
            this.updateInputValue();
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
                this.selectedOption = this.formControl.value;
                this.updateInputValue();
            }

            this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
                if (this.selectedOption !== value) {
                    this.selectedOption = value;
                    this.updateInputValue();
                }
            });
        }
    }

    /**
     * Actualiza el valor mostrado en el input basado en la selección actual
     */
    private updateInputValue(): void {
        if (this.selectedOption) {
            const selectedOptionObj = this.options.find(opt => opt.value === this.selectedOption);
            this.inputValue = selectedOptionObj ? selectedOptionObj.label : '';
        } else {
            this.inputValue = '';
        }
    }

    /** Funciones de callback para ControlValueAccessor */
    private onChange = (value: any) => {
        this.selectedOption = value;
    };
    private onTouched = () => { };

    /**
     * Establece el valor del campo (implementación de ControlValueAccessor)
     * Sincroniza el valor interno y el FormControl si existe
     */
    writeValue(value: any): void {
        this.selectedOption = value;
        this.updateInputValue();

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
     * Activa el estado de focus
     */
    onFocus(): void {
        this.isFocused = true;
        // NO llamar onTouched() aquí - solo marcar cuando haya cambio de valor
    }

    /**
     * Maneja el evento blur del input
     * Desactiva el estado de focus
     */
    onBlur(): void {
        this.isFocused = false;
        // Cerrar dropdown después de un pequeño delay para permitir clicks en opciones
        setTimeout(() => {
            if (!this.isFocused) {
                this.isOpen = false;
            }
        }, 150);
    }

    /**
     * Alterna la visibilidad del dropdown de opciones
     */
    toggleOptions(): void {
        if (!this.disabled) {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.filteredOptions = this.options;
            }
        }
    }

    /**
     * Maneja los cambios en el input de búsqueda
     * Filtra las opciones basado en el texto ingresado
     */
    onInputChange(event: Event): void {
        const inputValue = (event.target as HTMLInputElement).value;
        this.inputValue = inputValue;
        this.isOpen = true;

        // Filtrar opciones basado en el texto ingresado
        this.filteredOptions = this.options.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Si no hay texto, mostrar todas las opciones
        if (!inputValue.trim()) {
            this.filteredOptions = this.options;
        }
    }

    /**
     * Selecciona una opción del dropdown
     * Actualiza el valor y notifica los cambios
     */
    selectOption(option: SelectOption): void {
        this.selectedOption = option.value;
        this.inputValue = option.label;
        this.isOpen = false;

        // Notificar cambios
        this.onChange(option.value);
        this.onTouched(); // Solo marcar como touched cuando hay cambio real

        // Sincronizar con FormControl si existe
        if (this.formControl && this.formControl.value !== option.value) {
            this.formControl.setValue(option.value, { emitEvent: false });
        }
    }

    /**
     * Limpia la selección actual
     */
    clearSelection(): void {
        this.selectedOption = null;
        this.inputValue = '';
        this.filteredOptions = this.options;

        // Notificar cambios
        this.onChange(null);
        this.onTouched();

        // Sincronizar con FormControl si existe
        if (this.formControl) {
            this.formControl.setValue(null, { emitEvent: false });
        }
    }

    /**
     * Función de tracking para ngFor para mejorar performance
     */
    trackByValue(index: number, option: SelectOption): any {
        return option.value;
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
     * Maneja clics fuera del componente para cerrar el dropdown
     */
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Verificar que el ID sea válido antes de usar como selector
        if (!this.id || this.id.toString().trim() === '') {
            this.isOpen = false;
            return;
        }

        // Crear selectores válidos
        const containerSelector = `#${this.id}-container`;
        const componentSelector = `#${this.id}`;
        const listboxSelector = `#${this.id}-listbox`;

        try {
            // Verificar si el click está dentro del componente o su dropdown
            const isInsideContainer = target.closest(containerSelector);
            const isInsideComponent = target.closest(componentSelector);
            const isInsideListbox = target.closest(listboxSelector);

            if (!isInsideContainer && !isInsideComponent && !isInsideListbox) {
                this.isOpen = false;
            }
        } catch (error) {
            // En caso de error con el selector, cerrar el dropdown por seguridad
            console.warn('Error en selector del componente select:', error);
            this.isOpen = false;
        }
    }
}
