import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { billingForm } from '@/app/dashboard/customer/components/billing/form';

export type BillingDataFormControl = {
    invoiceRepresentation: FormControl<string | null>;
    billingDays: FormControl<string | null>;
    billingEmails: FormControl<string | null>;
    billingFrequency: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    automaticBilling: FormControl<string | null>;
}

@Component({
    selector: 'app-billing',
    imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
    templateUrl: './billing.component.html',
    styleUrl: './billing.component.css'
})
export class BillingComponent {

    readonly billingData = billingForm

    readonly invoiceRepresentationOptions = [
        { label: 'CFDI', value: 'cfdi' },
        { label: 'PAPEL', value: 'papel' }
    ]

    readonly billingDaysOptions = [
        { label: 'Lunes a Domingo (L-D)', value: 'l-d' },
        { label: 'Lunes a Viernes (L-V)', value: 'l-v' },
        { label: 'Lunes a Sábado (L-S)', value: 'l-s' },
        { label: 'Sábado y Domingo (S-D)', value: 's-d' }
    ]

    readonly billingFrequencyOptions = [
        { label: 'Variada', value: 'variada' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Quincenal', value: 'quincenal' }
    ]

    readonly automaticBillingOptions = [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
    ]

    private readonly fb = inject(FormBuilder);

    billingDataForm: FormGroup<BillingDataFormControl>

    constructor() {
        this.billingDataForm = this.fb.group({
            invoiceRepresentation: ['', []],
            billingDays: ['', []],
            billingEmails: ['', []],
            billingFrequency: ['', []],
            startDate: ['', []],
            endDate: ['', []],
            automaticBilling: ['', []],
        })
    }

}
