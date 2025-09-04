import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { saleForm } from '@/app/dashboard/customer/components/sale/form';
import { HotToastService } from '@ngxpert/hot-toast';

export type SaleDataFormControl = {
    accountType: FormControl<string | null>;
    seller: FormControl<string | null>;
    accountNumber: FormControl<string | null>;
    prepaidType: FormControl<string | null>;
    creditDays: FormControl<string | null>;
    creditLimit: FormControl<string | null>;
    advanceCommission: FormControl<string | null>;
    paymentMethod: FormControl<string | null>;
    voucherAmount: FormControl<string | null>;
}

@Component({
  selector: 'app-sale',
  imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

    readonly saleData = saleForm

    readonly accountTypeOptions = [
        { label: 'Prepago', value: 'prepago' },
        { label: 'Crédito', value: 'credito' },
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Control', value: 'control' }
    ]

    readonly prepaidTypeOptions = [
        { label: 'Cuenta Maestra', value: 'cuenta_maestra' },
        { label: 'Por Tarjetas', value: 'por_tarjetas' }
    ]

    readonly paymentMethodOptions = [
        { label: 'Transferencia Bancaria', value: 'transferencia' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
        { label: 'Tarjeta de Débito', value: 'tarjeta_debito' }
    ]

    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);

    saleDataForm: FormGroup<SaleDataFormControl>

    constructor() {
        this.saleDataForm = this.fb.group({
            accountType: ['', []],
            seller: ['', []],
            accountNumber: ['', []],
            prepaidType: ['', []],
            creditDays: ['', []],
            creditLimit: ['', []],
            advanceCommission: ['', []],
            paymentMethod: ['', []],
            voucherAmount: ['', []],
        })
    }

    onSubmit() {
        if (this.saleDataForm.valid) {
            this.toast.success('Formulario de Venta válido');
        }

        if (this.saleDataForm.invalid) {
            this.toast.error('Formulario de Venta invalido, Favor de revisar los campos requeridos.');
            this.saleDataForm.markAllAsTouched();
        }
    }
}
