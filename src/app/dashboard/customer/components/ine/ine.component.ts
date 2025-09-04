import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ineForm } from '@/app/dashboard/customer/components/ine/form';
import { HotToastService } from '@ngxpert/hot-toast';

export type IneDataFormControl = {
    accountingKey: FormControl<string | null>;
    processType: FormControl<string | null>;
    committeeType: FormControl<string | null>;
    scope: FormControl<string | null>;
    document: FormControl<File | File[] | null>;
}

@Component({
  selector: 'app-ine',
  imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent, FileInputFieldComponent],
  templateUrl: './ine.component.html',
  styleUrl: './ine.component.css'
})
export class IneComponent {

    readonly ineData = ineForm

    readonly processTypeOptions = [
        { label: 'Proceso Electoral', value: 'electoral' },
        { label: 'Consulta Popular', value: 'consultation' },
        { label: 'Referéndum', value: 'referendum' },
        { label: 'Revocación de Mandato', value: 'revocation' }
    ]

    readonly committeeTypeOptions = [
        { label: 'Comité Local', value: 'local' },
        { label: 'Comité Distrital', value: 'district' },
        { label: 'Comité Estatal', value: 'state' },
        { label: 'Comité Nacional', value: 'national' }
    ]

    readonly scopeOptions = [
        { label: 'Federal', value: 'federal' },
        { label: 'Estatal', value: 'state' },
        { label: 'Municipal', value: 'municipal' },
        { label: 'Local', value: 'local' }
    ]

    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);

    ineDataForm: FormGroup<IneDataFormControl>

    constructor() {
        this.ineDataForm = this.fb.group<IneDataFormControl>({
            accountingKey: this.fb.control<string | null>(null),
            processType: this.fb.control<string | null>(null),
            committeeType: this.fb.control<string | null>(null),
            scope: this.fb.control<string | null>(null),
            document: this.fb.control<File | File[] | null>(null),
        })
    }

    onSubmit() {
        if (this.ineDataForm.valid) {
            this.toast.success('Formulario de INE válido');
        }

        if (this.ineDataForm.invalid) {
            this.toast.error('Formulario de INE invalido, Favor de revisar los campos requeridos.');
            this.ineDataForm.markAllAsTouched();
        }
    }
}
