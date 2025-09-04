import { TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { creditRequestForm } from '@/app/dashboard/customer/components/credit-request/form';
import { CommonModule } from '@angular/common';

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
        console.log('Credit Request Data:', this.creditRequestForm.value);
    }

    onCancel(): void {
        this.creditRequestForm.reset();
        this.references.clear();
    }

    // Opcional: mejora performance al iterar el FormArray en el template
    trackByIndex(index: number): number {
        return index;
    }
}
