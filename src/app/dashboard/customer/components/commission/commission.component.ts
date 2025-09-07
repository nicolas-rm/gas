import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { commissionForm } from '@/app/dashboard/customer/components/commission/form';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { CommissionDataPageActions } from './ngrx/commission.actions';
import { 
    selectCommissionData, 
    selectCommissionDataLoading, 
    selectCommissionDataSaving, 
    selectCommissionDataIsBusy,
    selectCommissionDataError,
    selectCommissionDataHasUnsavedChanges,
    selectCommissionDataCanReset,
    selectCommissionDataOriginal,
    selectCommissionDataFormState
} from './ngrx/commission.selectors';
import { CommissionData } from './ngrx/commission.models';

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
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectCommissionDataLoading);
    isSaving = this.store.selectSignal(selectCommissionDataSaving);
    isBusy = this.store.selectSignal(selectCommissionDataIsBusy);
    error = this.store.selectSignal(selectCommissionDataError);
    hasUnsavedChanges = this.store.selectSignal(selectCommissionDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectCommissionDataCanReset);
    data = this.store.selectSignal(selectCommissionData);
    originalData = this.store.selectSignal(selectCommissionDataOriginal);
    formState = this.store.selectSignal(selectCommissionDataFormState);

    commissionDataForm: FormGroup<CommissionDataFormControl>

    constructor() {
        this.commissionDataForm = this.fb.group({
            commissionClassification: ['', []],
            customerLevel: ['', []],
            normalPercentage: ['', []],
            earlyPaymentPercentage: ['', []],
            incomeAccountingAccount: ['', []],
        })

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.commissionDataForm.patchValue(currentData, { emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.commissionDataForm.valueChanges.subscribe(value => {
            if (this.commissionDataForm.dirty) {
                const data = value as CommissionData;
                this.store.dispatch(CommissionDataPageActions.setData({ data }));
                this.store.dispatch(CommissionDataPageActions.markAsDirty());
            }
        });
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(CommissionDataPageActions.loadData({ customerId }));
    }

    // Actualizar campo individual
    updateField(field: keyof CommissionData, value: string | null): void {
        this.store.dispatch(CommissionDataPageActions.updateField({ field, value }));
    }

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
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(CommissionDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.commissionDataForm.markAsPristine();
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

    onSubmit() {
        this.saveData();
    }
}
