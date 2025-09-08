import { TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { creditRequestForm } from '@/app/dashboard/customer/components/credit-request/form';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
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

    creditRequestForm: FormGroup<CreditRequestDataFormControl>;

    // Control de hidratación / inicialización
    private hydrating = false;

    // ===== Normalización / utilidades =====
    private toStr = (v: any) => (v == null ? '' : String(v).trim());
    private isEmptyRef = (r: any) => !r || (!this.toStr(r.name) && !this.toStr(r.position) && !this.toStr(r.phone) && !this.toStr(r.email));

    private normalize = (d: CreditRequestData | null | undefined): CreditRequestData => ({
        legalRepresentative: d?.legalRepresentative?.trim() || null,
        documentsReceiver: d?.documentsReceiver?.trim() || null,
        creditApplicationDocument: d?.creditApplicationDocument || null,
        references: (d?.references || [])
            .filter(r => !this.isEmptyRef(r))
            .map(r => ({
                name: r?.name ?? null,
                position: r?.position ?? null,
                phone: r?.phone ?? null,
                email: r?.email ?? null,
            }))
    });

    private deepEq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

    constructor() {
        this.creditRequestForm = this.fb.group<CreditRequestDataFormControl>({
            legalRepresentative: this.fb.control<string | null>(null),
            documentsReceiver: this.fb.control<string | null>(null),
            creditApplicationDocument: this.fb.control<File | File[] | null>(null),
            references: this.fb.array<FormGroup<ReferenceDataFormControl>>([])
        });
        // Añadir fila inicial silenciosa de referencia
        this.addBlankReferenceSilent();

        // Store -> Form (reactivo al store)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.hydrating = true;
                try {
                    const norm = this.normalize(currentData);
                    this.rebuildReferences(norm.references);
                    this.creditRequestForm.patchValue({
                        legalRepresentative: norm.legalRepresentative,
                        documentsReceiver: norm.documentsReceiver,
                        creditApplicationDocument: norm.creditApplicationDocument
                    }, { emitEvent: false });
                    this.creditRequestForm.markAsPristine();
                } finally {
                    this.hydrating = false;
                }
            } else {
                this.hydrating = true;
                try {
                    this.creditRequestForm.reset({}, { emitEvent: false });
                    this.references.clear();
                    this.addBlankReferenceSilent();
                    this.creditRequestForm.markAsPristine();
                    this.creditRequestForm.markAsUntouched();
                } finally {
                    this.hydrating = false;
                }
            }
        });

        // Effect habilitar / deshabilitar
        effect(() => {
            const busy = this.isBusy();
            if (busy) {
                this.creditRequestForm.disable({ emitEvent: false });
            } else {
                this.creditRequestForm.enable({ emitEvent: false });
            }
        });

        this.wireFormChanges();
    }

    private wireFormChanges() {
        this.creditRequestForm.valueChanges.pipe(
            skip(1),
            debounceTime(300),
            filter(() => !this.hydrating),
            map(() => this.normalize(this.creditRequestForm.getRawValue() as CreditRequestData)),
            distinctUntilChanged((a, b) => this.deepEq(a, b)),
            takeUntilDestroyed()
        ).subscribe(value => {
            this.store.dispatch(CreditRequestDataPageActions.setData({ data: value }));
            const orig = this.normalize(this.originalData() ?? { legalRepresentative: null, documentsReceiver: null, creditApplicationDocument: null, references: [] });
            if (!this.deepEq(value, orig)) {
                this.store.dispatch(CreditRequestDataPageActions.markAsDirty());
            } else {
                this.store.dispatch(CreditRequestDataPageActions.markAsPristine());
            }
        });
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
            name: this.fb.control<string | null>(value?.name ?? null),
            position: this.fb.control<string | null>(value?.position ?? null),
            phone: this.fb.control<string | null>(value?.phone ?? null),
            email: this.fb.control<string | null>(value?.email ?? null),
        });
    }

    private addBlankReferenceSilent(): void {
        this.hydrating = true;
        try {
            if (this.references.length === 0) {
                this.references.push(this.createReferenceFormGroup());
                this.creditRequestForm.updateValueAndValidity({ emitEvent: false });
                this.creditRequestForm.markAsPristine();
            }
        } finally {
            this.hydrating = false;
        }
    }

    private rebuildReferences(refs: ReferenceData[]): void {
        const arr = this.references;
        if (typeof (arr as any).clear === 'function') {
            (arr as any).clear({ emitEvent: false });
        } else {
            while (arr.length) arr.removeAt(arr.length - 1, { emitEvent: false } as any);
        }
        if (refs.length === 0) {
            arr.push(this.createReferenceFormGroup(), { emitEvent: false });
        } else {
            refs.forEach(r => arr.push(this.createReferenceFormGroup(r), { emitEvent: false }));
        }
    }

    addReference(): void {
        if (this.canAddReference) {
            this.references.push(this.createReferenceFormGroup());
        }
    }

    removeReference(index: number): void {
        if (this.canRemoveReference(index)) {
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

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.normalize(this.creditRequestForm.getRawValue() as CreditRequestData);
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
        this.hydrating = true;
        try {
            this.creditRequestForm.reset({}, { emitEvent: false });
            this.references.clear();
            this.addBlankReferenceSilent();
            this.creditRequestForm.markAsPristine();
            this.creditRequestForm.markAsUntouched();
        } finally {
            this.hydrating = false;
        }
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        const orig = this.normalize(this.originalData() ?? { legalRepresentative: null, documentsReceiver: null, creditApplicationDocument: null, references: [] });
        this.hydrating = true;
        try {
            this.rebuildReferences(orig.references);
            this.creditRequestForm.patchValue({
                legalRepresentative: orig.legalRepresentative,
                documentsReceiver: orig.documentsReceiver,
                creditApplicationDocument: orig.creditApplicationDocument
            }, { emitEvent: false });
            this.creditRequestForm.markAsPristine();
            this.creditRequestForm.markAsUntouched();
            this.store.dispatch(CreditRequestDataPageActions.setData({ data: orig }));
            this.store.dispatch(CreditRequestDataPageActions.markAsPristine());
        } finally {
            this.hydrating = false;
        }
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
