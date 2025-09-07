import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { contractForm } from '@/app/dashboard/customer/components/contract/form';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { ContractDataPageActions } from './ngrx/contract.actions';
import { 
    selectContractData, 
    selectContractDataLoading, 
    selectContractDataSaving, 
    selectContractDataIsBusy,
    selectContractDataError,
    selectContractDataHasUnsavedChanges,
    selectContractDataCanReset,
    selectContractDataOriginal,
    selectContractDataFormState
} from './ngrx/contract.selectors';
import { ContractData } from './ngrx/contract.models';

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
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectContractDataLoading);
    isSaving = this.store.selectSignal(selectContractDataSaving);
    isBusy = this.store.selectSignal(selectContractDataIsBusy);
    error = this.store.selectSignal(selectContractDataError);
    hasUnsavedChanges = this.store.selectSignal(selectContractDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectContractDataCanReset);
    data = this.store.selectSignal(selectContractData);
    originalData = this.store.selectSignal(selectContractDataOriginal);
    formState = this.store.selectSignal(selectContractDataFormState);

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

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.contractDataForm.patchValue(currentData, { emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.contractDataForm.valueChanges.subscribe(value => {
            if (this.contractDataForm.dirty) {
                const data = value as ContractData;
                this.store.dispatch(ContractDataPageActions.setData({ data }));
                this.store.dispatch(ContractDataPageActions.markAsDirty());
            }
        });
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(ContractDataPageActions.loadData({ customerId }));
    }

    // Actualizar campo individual
    updateField(field: keyof ContractData, value: string | null): void {
        this.store.dispatch(ContractDataPageActions.updateField({ field, value }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.contractDataForm.getRawValue() as ContractData;
        this.store.dispatch(
            ContractDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.contractDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.contractDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(ContractDataPageActions.resetForm());
        this.contractDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.contractDataForm.markAsPristine(); // Marca el form como pristine
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(ContractDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.contractDataForm.markAsPristine();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(ContractDataPageActions.markAsPristine());
        this.contractDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(ContractDataPageActions.clearErrors());
    }

    onSubmit() {
        this.saveData();
    }
}
