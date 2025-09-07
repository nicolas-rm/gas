import { TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { creditRequestForm } from '@/app/dashboard/customer/components/credit-request/form';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { CreditRequestDataPageActions } from './ngrx/credit-request.actions';
import { 
    selectCreditRequestData, 
    selectCreditRequestDataLoading, 
    selectCreditRequestDataSaving, 
    selectCreditRequestDataIsBusy,
    selectCreditRequestDataError,
    selectCreditRequestDataHasUnsavedChanges,
    selectCreditRequestDataCanReset,
    selectCreditRequestDataOriginal,
    selectCreditRequestDataFormState
} from './ngrx/credit-request.selectors';
import { CreditRequestData } from './ngrx/credit-request.models';

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
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, FileInputFieldComponent],
    templateUrl: './credit-request.component.html',
    styleUrl: './credit-request.component.css'
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
    formState = this.store.selectSignal(selectCreditRequestDataFormState);

    creditRequestForm: FormGroup<CreditRequestDataFormControl>;

    constructor() {
        this.creditRequestForm = this.fb.group<CreditRequestDataFormControl>({
            legalRepresentative: this.fb.control<string | null>(null),
            documentsReceiver: this.fb.control<string | null>(null),
            creditApplicationDocument: this.fb.control<File | File[] | null>(null),
            references: this.fb.array<FormGroup<ReferenceDataFormControl>>([])
        });
        
        // Agregar una referencia inicial
        this.addReference();

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.creditRequestForm.patchValue(currentData, { emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.creditRequestForm.valueChanges.subscribe(value => {
            if (this.creditRequestForm.dirty) {
                const data = value as CreditRequestData;
                this.store.dispatch(CreditRequestDataPageActions.setData({ data }));
                this.store.dispatch(CreditRequestDataPageActions.markAsDirty());
            }
        });
    }

    get references(): FormArray<FormGroup<ReferenceDataFormControl>> {
        return this.creditRequestForm.get('references') as FormArray<FormGroup<ReferenceDataFormControl>>;
    }

    get canAddReference(): boolean {
        return this.references.length < this.maxReferences;
    }

    createReferenceFormGroup(): FormGroup<ReferenceDataFormControl> {
        return this.fb.group<ReferenceDataFormControl>({
            name: this.fb.control<string | null>(null),
            position: this.fb.control<string | null>(null),
            phone: this.fb.control<string | null>(null),
            email: this.fb.control<string | null>(null),
        });
    }

    addReference(): void {
        if (this.canAddReference) {
            this.references.push(this.createReferenceFormGroup());
        }
    }

    removeReference(index: number): void {
        if (index >= 0 && index < this.references.length) {
            this.references.removeAt(index);
        }
    }

    onSave(): void {
        this.saveData();
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(CreditRequestDataPageActions.loadData({ customerId }));
    }

    // Actualizar campo individual
    updateField(field: keyof CreditRequestData, value: any): void {
        this.store.dispatch(CreditRequestDataPageActions.updateField({ field, value }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.creditRequestForm.getRawValue() as CreditRequestData;
        this.store.dispatch(
            CreditRequestDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
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
        this.creditRequestForm.markAsPristine(); // Marca el form como pristine
        this.references.clear();
        this.addReference(); // Agregar referencia inicial
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(CreditRequestDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.creditRequestForm.markAsPristine();
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
    trackByIndex(index: number): number {
        return index;
    }
}
