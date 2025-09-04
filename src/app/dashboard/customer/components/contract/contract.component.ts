import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { contractForm } from '@/app/dashboard/customer/components/contract/form';

export type ContractDataFormControl = {
    printName: FormControl<string | null>;
    adminFee: FormControl<string | null>;
    cardIssueFee: FormControl<string | null>;
    reportsFee: FormControl<string | null>;
    accountingAccount: FormControl<string | null>;
    cfdiUsage: FormControl<string | null>;
    type: FormControl<string | null>;
    loyalty: FormControl<string | null>;
    percentage: FormControl<string | null>;
    rfcOrderingAccount: FormControl<string | null>;
    bank: FormControl<string | null>;
}

@Component({
  selector: 'app-contract',
  imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.css'
})
export class ContractComponent {

    // Agregar después de la línea 28 (readonly contractData = contractForm)
    
    readonly cfdiUsageOptions = [
        { label: 'G01 - Adquisición de mercancías', value: 'G01' },
        { label: 'G02 - Devoluciones, descuentos o bonificaciones', value: 'G02' },
        { label: 'G03 - Gastos en general', value: 'G03' },
        { label: 'I01 - Construcciones', value: 'I01' },
        { label: 'I02 - Mobiliario y equipo de oficina por inversiones', value: 'I02' }
    ]
    
    readonly typeOptions = [
        { label: 'Corporativo', value: 'corporativo' },
        { label: 'Individual', value: 'individual' },
        { label: 'Gobierno', value: 'gobierno' },
        { label: 'Sin fines de lucro', value: 'sin_fines_lucro' }
    ]
    
    readonly loyaltyOptions = [
        { label: 'Programa Básico', value: 'basico' },
        { label: 'Programa Premium', value: 'premium' },
        { label: 'Programa VIP', value: 'vip' },
        { label: 'Sin programa', value: 'ninguno' }
    ]
    
    readonly bankOptions = [
        { label: 'BBVA México', value: 'bbva' },
        { label: 'Santander México', value: 'santander' },
        { label: 'Banamex', value: 'banamex' },
        { label: 'Banorte', value: 'banorte' },
        { label: 'HSBC México', value: 'hsbc' },
        { label: 'Scotiabank México', value: 'scotiabank' }
    ]

    readonly contractData = contractForm

    private readonly fb = inject(FormBuilder);

    contractDataForm: FormGroup<ContractDataFormControl>

    constructor() {
        this.contractDataForm = this.fb.group({
            printName: ['', []],
            adminFee: ['', []],
            cardIssueFee: ['', []],
            reportsFee: ['', []],
            accountingAccount: ['', []],
            cfdiUsage: ['', []],
            type: ['', []],
            loyalty: ['', []],
            percentage: ['', []],
            rfcOrderingAccount: ['', []],
            bank: ['', []],
        })
    }

}
