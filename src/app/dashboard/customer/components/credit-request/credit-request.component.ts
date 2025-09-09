// Angular
import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// NgRx
import { Store } from '@ngrx/store';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes
import { TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';

// Config del formulario (labels, ids, etc.)
import { creditRequestForm } from '@/app/dashboard/customer/components/credit-request/form';

// NgRx Credit Request
import { CreditRequestDataPageActions } from './ngrx/credit-request.actions';
import { 
    selectCreditRequestData, 
    selectCreditRequestDataLoading, 
    selectCreditRequestDataSaving, 
    selectCreditRequestDataIsBusy,
    selectCreditRequestDataError,
    selectCreditRequestDataHasUnsavedChanges,
    selectCreditRequestDataCanReset,
    selectCreditRequestDataOriginal
} from './ngrx/credit-request.selectors';
import { CreditRequestData, ReferenceData } from './ngrx/credit-request.models';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

// === UTILIDADES ===
const isEmptyReference = (reference?: ReferenceData | null): boolean => {
    if (!reference) return true;
    const trim = (value: unknown) => typeof value === 'string' ? value.trim() : value;
    return [reference.name, reference.position, reference.phone, reference.email]
        .map(trim)
        .every(value => !value);
};

export type CreditRequestDataFormControl = {
    legalRepresentative: FormControl<string | null>;
    documentsReceiver: FormControl<string | null>;
    creditApplicationDocument: FormControl<File | File[] | null>;
    references: FormArray<FormGroup<ReferenceDataFormControl>>;
}

export type ReferenceDataFormControl = {
    name: FormControl<string | null>;
    position: FormControl<string | null>;
    phone: FormControl<string | null>;
    email: FormControl<string | null>;
}

@Component({
    selector: 'app-credit-request',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, FileInputFieldComponent],
    templateUrl: './credit-request.component.html',
    styleUrl: './credit-request.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditRequestComponent {
    readonly creditRequestData = creditRequestForm.creditRequest;
    readonly referenceData = creditRequestForm.reference; 
    readonly maxReferences = 3;

    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectCreditRequestDataLoading);
    isSaving = this.store.selectSignal(selectCreditRequestDataSaving);
    isBusy = this.store.selectSignal(selectCreditRequestDataIsBusy);
    error = this.store.selectSignal(selectCreditRequestDataError);
    hasUnsavedChanges = this.store.selectSignal(selectCreditRequestDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectCreditRequestDataCanReset);
    data = this.store.selectSignal(selectCreditRequestData);
    originalData = this.store.selectSignal(selectCreditRequestDataOriginal);

    creditRequestForm: FormGroup<CreditRequestDataFormControl> = this.fb.group<CreditRequestDataFormControl>({
        legalRepresentative: this.fb.control<string | null>(null),
        documentsReceiver: this.fb.control<string | null>(null),
        creditApplicationDocument: this.fb.control<File | File[] | null>(null),
        references: this.fb.array<FormGroup<ReferenceDataFormControl>>([])
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            const referencesArray = this.references;
            
            if (d) {
                // Actualizar campos principales sin emitir eventos
                this.creditRequestForm.patchValue({
                    legalRepresentative: d.legalRepresentative,
                    documentsReceiver: d.documentsReceiver,
                    creditApplicationDocument: d.creditApplicationDocument
                }, { emitEvent: false });
                
                // Manejar el FormArray de referencias
                if (d.references && Array.isArray(d.references)) {
                    // Solo reconstruir si la estructura es diferente
                    const currentReferences = referencesArray.controls.map(ctrl => ctrl.getRawValue());
                    const needsSync = currentReferences.length !== d.references.length || 
                                     JSON.stringify(currentReferences) !== JSON.stringify(d.references);
                    
                    if (needsSync) {
                        referencesArray.clear({ emitEvent: false });
                        d.references.forEach(reference => {
                            referencesArray.push(this.createReferenceFormGroup(reference), { emitEvent: false });
                        });
                    }
                } else {
                    // Asegurar que siempre haya al menos una referencia vacía
                    if (referencesArray.length === 0) {
                        referencesArray.push(this.createReferenceFormGroup(), { emitEvent: false });
                    }
                }
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                if (referencesArray.length > 0) {
                    this.creditRequestForm.reset({}, { emitEvent: false });
                    referencesArray.clear({ emitEvent: false });
                    this.creditRequestForm.markAsPristine();
                    this.creditRequestForm.markAsUntouched();
                }
                // Asegurar que siempre haya al menos una referencia vacía
                if (referencesArray.length === 0) {
                    referencesArray.push(this.createReferenceFormGroup(), { emitEvent: false });
                }
            }
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            if (busy) {
                this.creditRequestForm.disable({ emitEvent: false });
            } else {
                this.creditRequestForm.enable({ emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.creditRequestForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.creditRequestForm.getRawValue() as CreditRequestData;
                this.store.dispatch(CreditRequestDataPageActions.setData({ data }));
                this.store.dispatch(CreditRequestDataPageActions.markAsDirty());
            });
        
        // Asegurar que siempre haya al menos una referencia al inicio
        if (this.references.length === 0) {
            this.references.push(this.createReferenceFormGroup(), { emitEvent: false });
        }
    }

    get references(): FormArray<FormGroup<ReferenceDataFormControl>> {
        return this.creditRequestForm.get('references') as FormArray<FormGroup<ReferenceDataFormControl>>;
    }

    get canAddReference(): boolean {
        return this.references.length < this.maxReferences;
    }

    canRemoveReference(index: number): boolean {
        return this.references.length > 1 && index > 0; // No eliminar la primera
    }

    createReferenceFormGroup(value?: Partial<ReferenceData>): FormGroup<ReferenceDataFormControl> {
        return this.fb.group<ReferenceDataFormControl>({
            name: this.fb.control<string | null>(value?.name ?? '', [ReactiveValidators.required]),
            position: this.fb.control<string | null>(value?.position ?? '', []),
            phone: this.fb.control<string | null>(value?.phone ?? '', [ReactiveValidators.required]),
            email: this.fb.control<string | null>(value?.email ?? '', [ReactiveValidators.required, ReactiveValidators.email]),
        });
    }

    addReference(): void {
        if (this.canAddReference) {
            // Agregar referencia sin emitir evento para evitar marcar como dirty
            this.references.push(this.createReferenceFormGroup(), { emitEvent: false });
        }
    }

    removeReference(index: number): void {
        if (this.canRemoveReference(index)) {
            // Verificar si la referencia está vacía para decidir si emitir evento
            const referenceValue = this.references.at(index)?.getRawValue() as ReferenceData;
            const isDraft = isEmptyReference(referenceValue);
            this.references.removeAt(index, { emitEvent: !isDraft });
        }
    }

    onSave(): void {
        this.saveData();
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(CreditRequestDataPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const formData = this.creditRequestForm.getRawValue();
        
        // Filtrar referencias vacías antes de guardar
        const allReferences: ReferenceData[] = this.references.controls.map(ctrl => ctrl.getRawValue() as ReferenceData);
        const references = allReferences.filter(reference => !isEmptyReference(reference));
        
        const data: CreditRequestData = {
            ...formData,
            references
        } as CreditRequestData;
        
        this.store.dispatch(
            CreditRequestDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.creditRequestForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.creditRequestForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(CreditRequestDataPageActions.resetForm());
        this.creditRequestForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.references.clear({ emitEvent: false });
        this.creditRequestForm.markAsPristine(); // Marca el form como pristine
        this.creditRequestForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(CreditRequestDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.creditRequestForm.markAsPristine();
        this.creditRequestForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(CreditRequestDataPageActions.markAsPristine());
        this.creditRequestForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(CreditRequestDataPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }

    onCancel(): void {
        this.resetToOriginal();
    }

    // Opcional: mejora performance al iterar el FormArray en el template
    trackByReference = (_i: number, ctrl: FormGroup<ReferenceDataFormControl>) => ctrl;
}
