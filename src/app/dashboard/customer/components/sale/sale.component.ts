import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { saleForm } from '@/app/dashboard/customer/components/sale/form';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { SaleDataPageActions } from './ngrx/sale.actions';
import { 
    selectSaleData, 
    selectSaleDataLoading, 
    selectSaleDataSaving, 
    selectSaleDataIsBusy,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    selectSaleDataCanReset,
    selectSaleDataOriginal,
    selectSaleDataFormState
} from './ngrx/sale.selectors';
import { SaleData } from './ngrx/sale.models';

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
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectSaleDataLoading);
    isSaving = this.store.selectSignal(selectSaleDataSaving);
    isBusy = this.store.selectSignal(selectSaleDataIsBusy);
    error = this.store.selectSignal(selectSaleDataError);
    hasUnsavedChanges = this.store.selectSignal(selectSaleDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectSaleDataCanReset);
    data = this.store.selectSignal(selectSaleData);
    originalData = this.store.selectSignal(selectSaleDataOriginal);
    formState = this.store.selectSignal(selectSaleDataFormState);

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

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.saleDataForm.patchValue(currentData, { emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.saleDataForm.valueChanges.subscribe(value => {
            if (this.saleDataForm.dirty) {
                const data = value as SaleData;
                this.store.dispatch(SaleDataPageActions.setData({ data }));
                this.store.dispatch(SaleDataPageActions.markAsDirty());
            }
        });
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(SaleDataPageActions.loadData({ customerId }));
    }

    // Actualizar campo individual
    updateField(field: keyof SaleData, value: string | null): void {
        this.store.dispatch(SaleDataPageActions.updateField({ field, value }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.saleDataForm.getRawValue() as SaleData;
        this.store.dispatch(
            SaleDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.saleDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.saleDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(SaleDataPageActions.resetForm());
        this.saleDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.saleDataForm.markAsPristine(); // Marca el form como pristine
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(SaleDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.saleDataForm.markAsPristine();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(SaleDataPageActions.markAsPristine());
        this.saleDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(SaleDataPageActions.clearErrors());
    }

    onSubmit() {
        this.saveData();
    }
}
