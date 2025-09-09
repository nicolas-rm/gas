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
import { commissionForm } from '@/app/dashboard/customer/components/commission/form';

// NgRx Commission Data
import { CommissionDataPageActions } from '@/dashboard/customer/components/commission/ngrx/commission.actions';
import {
    selectCommissionData,
    selectCommissionDataOriginal,
    selectCommissionDataIsBusy,
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    selectCommissionDataError,
    selectCommissionDataHasUnsavedChanges,
    selectCommissionDataCanReset
} from '@/dashboard/customer/components/commission/ngrx/commission.selectors';
import { CommissionData } from '@/dashboard/customer/components/commission/ngrx/commission.models';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
    selector: 'app-commission',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectFieldComponent, TextFieldComponent],
    templateUrl: './commission.component.html',
    styleUrl: './commission.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommissionComponent {

    // UI metadata (labels, placeholders…)
    readonly commission = commissionForm;

    readonly commissionClassificationOptions = [
        { label: 'Comisión por Venta', value: 'venta' },
        { label: 'Comisión por Volumen', value: 'volumen' },
        { label: 'Comisión Fija', value: 'fija' }
    ];

    readonly customerLevelOptions = [
        { label: 'Nivel 1 - Premium', value: 'nivel1' },
        { label: 'Nivel 2 - Estándar', value: 'nivel2' },
        { label: 'Nivel 3 - Básico', value: 'nivel3' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // Signals desde NgRx (ya los tenías)
    isLoading = this.store.selectSignal(selectCommissionDataLoading);
    isSaving = this.store.selectSignal(selectCommissionDataSaving);
    isBusy = this.store.selectSignal(selectCommissionDataIsBusy);
    error = this.store.selectSignal(selectCommissionDataError);
    hasUnsavedChanges = this.store.selectSignal(selectCommissionDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectCommissionDataCanReset);
    data = this.store.selectSignal(selectCommissionData);
    originalData = this.store.selectSignal(selectCommissionDataOriginal);
    // formState selector removido tras simplificación

    // FormGroup tipado a partir de tu modelo CommissionData
    commissionDataForm: FormGroup<ControlsOf<CommissionData>> = this.fb.group<ControlsOf<CommissionData>>({
        commissionClassification: this.fb.control<string | null>(null, ReactiveValidators.required),
        customerLevel: this.fb.control<string | null>(null, ReactiveValidators.required),
        normalPercentage: this.fb.control<string | null>(null),
        earlyPaymentPercentage: this.fb.control<string | null>(null),
        incomeAccountingAccount: this.fb.control<string | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            if (d) {
                this.commissionDataForm.patchValue(d, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.commissionDataForm.reset({}, { emitEvent: false });
                this.commissionDataForm.markAsPristine();
                this.commissionDataForm.markAsUntouched();
            }
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            if (busy) {
                this.commissionDataForm.disable({ emitEvent: false });
            } else {
                this.commissionDataForm.enable({ emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.commissionDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.commissionDataForm.getRawValue() as CommissionData;
                this.store.dispatch(CommissionDataPageActions.setData({ data }));
                this.store.dispatch(CommissionDataPageActions.markAsDirty());
            });
    }

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(CommissionDataPageActions.loadData({ customerId }));
    }

    // (Eliminado updateField granular; ahora todo se maneja vía setData)

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.commissionDataForm.getRawValue() as CommissionData;
        this.store.dispatch(
            CommissionDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.commissionDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.commissionDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(CommissionDataPageActions.resetForm());
        this.commissionDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.commissionDataForm.markAsPristine(); // Marca el form como pristine
        this.commissionDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(CommissionDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.commissionDataForm.markAsPristine();
        this.commissionDataForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(CommissionDataPageActions.markAsPristine());
        this.commissionDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(CommissionDataPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }
}
