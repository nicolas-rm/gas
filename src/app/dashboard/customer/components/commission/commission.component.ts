import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { commissionForm } from '@/app/dashboard/customer/components/commission/form';

export type CommissionDataFormControl = {
    commissionClassification: FormControl<string | null>;
    customerLevel: FormControl<string | null>;
    normalPercentage: FormControl<string | null>;
    earlyPaymentPercentage: FormControl<string | null>;
    incomeAccountingAccount: FormControl<string | null>;
}

@Component({
  selector: 'app-commission',
  imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
  templateUrl: './commission.component.html',
  styleUrl: './commission.component.css'
})
export class CommissionComponent {

    readonly commissionData = commissionForm

    readonly commissionClassificationOptions = [
        { label: 'Comisión por Venta', value: 'venta' },
        { label: 'Comisión por Volumen', value: 'volumen' },
        { label: 'Comisión Fija', value: 'fija' }
    ]

    readonly customerLevelOptions = [
        { label: 'Nivel 1 - Premium', value: 'nivel1' },
        { label: 'Nivel 2 - Estándar', value: 'nivel2' },
        { label: 'Nivel 3 - Básico', value: 'nivel3' }
    ]

    private readonly fb = inject(FormBuilder);

    commissionDataForm: FormGroup<CommissionDataFormControl>

    constructor() {
        this.commissionDataForm = this.fb.group({
            commissionClassification: ['', []],
            customerLevel: ['', []],
            normalPercentage: ['', []],
            earlyPaymentPercentage: ['', []],
            incomeAccountingAccount: ['', []],
        })
    }

}
