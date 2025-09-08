import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { billingForm } from '@/app/dashboard/customer/components/billing/form';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { BillingDataPageActions } from './ngrx/billing.actions';
import { 
    selectBillingData, 
    selectBillingDataLoading, 
    selectBillingDataSaving, 
    selectBillingDataIsBusy,
    selectBillingDataError,
    selectBillingDataHasUnsavedChanges,
    selectBillingDataCanReset,
    selectBillingDataOriginal,
    selectBillingDataFormState
} from './ngrx/billing.selectors';
import { BillingData } from './ngrx/billing.models';

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
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectBillingDataLoading);
    isSaving = this.store.selectSignal(selectBillingDataSaving);
    isBusy = this.store.selectSignal(selectBillingDataIsBusy);
    error = this.store.selectSignal(selectBillingDataError);
    hasUnsavedChanges = this.store.selectSignal(selectBillingDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectBillingDataCanReset);
    data = this.store.selectSignal(selectBillingData);
    originalData = this.store.selectSignal(selectBillingDataOriginal);
    formState = this.store.selectSignal(selectBillingDataFormState);

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

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.billingDataForm.patchValue(currentData, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.billingDataForm.reset({}, { emitEvent: false });
                this.billingDataForm.markAsPristine();
                this.billingDataForm.markAsUntouched();
            }
        });

        // Form -> Store (cambios del form)
        this.billingDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.billingDataForm.getRawValue() as BillingData;
                this.store.dispatch(BillingDataPageActions.setData({ data }));
                this.store.dispatch(BillingDataPageActions.markAsDirty());
            });
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(BillingDataPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.billingDataForm.getRawValue() as BillingData;
        this.store.dispatch(
            BillingDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.billingDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.billingDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(BillingDataPageActions.resetForm());
        this.billingDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.billingDataForm.markAsPristine(); // Marca el form como pristine
        this.billingDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(BillingDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.billingDataForm.markAsPristine();
        this.billingDataForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(BillingDataPageActions.markAsPristine());
        this.billingDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(BillingDataPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }
}
