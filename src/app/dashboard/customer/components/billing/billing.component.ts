// Angular
import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// NgRx
import { Store } from '@ngrx/store';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes
import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';

// Config del formulario (labels, ids, etc.)
import { billingForm } from '@/app/dashboard/customer/components/billing/form';

// NgRx Billing Data
import { BillingDataPageActions } from '@/dashboard/customer/components/billing/ngrx/billing.actions';
import {
    selectBillingData,
    selectBillingDataOriginal,
    selectBillingDataIsBusy,
    selectBillingDataLoading,
    selectBillingDataSaving,
    selectBillingDataError,
    selectBillingDataHasUnsavedChanges,
    selectBillingDataCanReset
} from '@/dashboard/customer/components/billing/ngrx/billing.selectors';
import { BillingData } from '@/dashboard/customer/components/billing/ngrx/billing.models';

// Customer global state
import { selectIsReadonlyMode } from '@/app/dashboard/customer/ngrx';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectFieldComponent, TextFieldComponent],
    templateUrl: './billing.component.html',
    styleUrl: './billing.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingComponent {

    // UI metadata (labels, placeholders…)
    readonly billing = billingForm;

    readonly invoiceRepresentationOptions = [
        { label: 'CFDI', value: 'cfdi' },
        { label: 'PAPEL', value: 'papel' }
    ];

    readonly billingDaysOptions = [
        { label: 'Lunes a Domingo (L-D)', value: 'l-d' },
        { label: 'Lunes a Viernes (L-V)', value: 'l-v' },
        { label: 'Lunes a Sábado (L-S)', value: 'l-s' },
        { label: 'Sábado y Domingo (S-D)', value: 's-d' }
    ];

    readonly billingFrequencyOptions = [
        { label: 'Variada', value: 'variada' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Quincenal', value: 'quincenal' }
    ];

    readonly automaticBillingOptions = [
        { label: 'Sí', value: 'si' },
        { label: 'No', value: 'no' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectBillingDataLoading);
    isSaving = this.store.selectSignal(selectBillingDataSaving);
    isBusy = this.store.selectSignal(selectBillingDataIsBusy);
    error = this.store.selectSignal(selectBillingDataError);
    hasUnsavedChanges = this.store.selectSignal(selectBillingDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectBillingDataCanReset);
    data = this.store.selectSignal(selectBillingData);
    originalData = this.store.selectSignal(selectBillingDataOriginal);
    
    // Signal para modo readonly desde estado global
    isReadonlyMode = this.store.selectSignal(selectIsReadonlyMode);

    // FormGroup tipado a partir de tu modelo BillingData
    billingDataForm: FormGroup<ControlsOf<BillingData>> = this.fb.group<ControlsOf<BillingData>>({
        invoiceRepresentation: this.fb.control<string | null>(null, ReactiveValidators.required),
        billingDays: this.fb.control<string | null>(null),
        billingEmails: this.fb.control<string | null>(null),
        billingFrequency: this.fb.control<string | null>(null),
        startDate: this.fb.control<string | null>(null),
        endDate: this.fb.control<string | null>(null),
        automaticBilling: this.fb.control<string | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            if (d) {
                this.billingDataForm.patchValue(d, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.billingDataForm.reset({}, { emitEvent: false });
                this.billingDataForm.markAsPristine();
                this.billingDataForm.markAsUntouched();
            }
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            const readonly = this.isReadonlyMode();
            
            if (busy || readonly) {
                this.billingDataForm.disable({ emitEvent: false });
            } else {
                this.billingDataForm.enable({ emitEvent: false });
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

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(BillingDataPageActions.loadData({ customerId }));
    }

    // (Eliminado updateField granular; ahora todo se maneja vía setData)

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
