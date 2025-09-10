// Angular
import { Component, inject, effect, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

// NgRx
import { Store } from '@ngrx/store';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes
import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Config del formulario (labels, ids, etc.)
import { contractForm } from '@/app/dashboard/customer/components/contract/form';

// NgRx Contract Data
import { ContractDataPageActions } from '@/dashboard/customer/components/contract/ngrx/contract.actions';
import { 
    selectContractData, 
    selectContractDataLoading, 
    selectContractDataSaving, 
    selectContractDataIsBusy,
    selectContractDataError,
    selectContractDataHasUnsavedChanges,
    selectContractDataCanReset,
    selectContractDataOriginal
} from '@/dashboard/customer/components/contract/ngrx/contract.selectors';
import { ContractData } from '@/dashboard/customer/components/contract/ngrx/contract.models';

// Customer global state
import { selectIsReadonlyMode } from '@/app/dashboard/customer/ngrx';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
    selector: 'app-contract',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
    templateUrl: './contract.component.html',
    styleUrl: './contract.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractComponent {

    // UI metadata (labels, placeholders…)
    readonly contractData = contractForm;
    
    readonly cfdiUsageOptions = [
        { label: 'G01 - Adquisición de mercancías', value: 'G01' },
        { label: 'G02 - Devoluciones, descuentos o bonificaciones', value: 'G02' },
        { label: 'G03 - Gastos en general', value: 'G03' },
        { label: 'I01 - Construcciones', value: 'I01' },
        { label: 'I02 - Mobiliario y equipo de oficina por inversiones', value: 'I02' }
    ];
    
    readonly typeOptions = [
        { label: 'Corporativo', value: 'corporativo' },
        { label: 'Individual', value: 'individual' },
        { label: 'Gobierno', value: 'gobierno' },
        { label: 'Sin fines de lucro', value: 'sin_fines_lucro' }
    ];
    
    readonly loyaltyOptions = [
        { label: 'Programa Básico', value: 'basico' },
        { label: 'Programa Premium', value: 'premium' },
        { label: 'Programa VIP', value: 'vip' },
        { label: 'Sin programa', value: 'ninguno' }
    ];
    
    readonly bankOptions = [
        { label: 'BBVA México', value: 'bbva' },
        { label: 'Santander México', value: 'santander' },
        { label: 'Banamex', value: 'banamex' },
        { label: 'Banorte', value: 'banorte' },
        { label: 'HSBC México', value: 'hsbc' },
        { label: 'Scotiabank México', value: 'scotiabank' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectContractDataLoading);
    isSaving = this.store.selectSignal(selectContractDataSaving);
    isBusy = this.store.selectSignal(selectContractDataIsBusy);
    error = this.store.selectSignal(selectContractDataError);
    hasUnsavedChanges = this.store.selectSignal(selectContractDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectContractDataCanReset);
    data = this.store.selectSignal(selectContractData);
    originalData = this.store.selectSignal(selectContractDataOriginal);
    
    // Signal para modo readonly desde estado global
    isReadonlyMode = this.store.selectSignal(selectIsReadonlyMode);

    // FormGroup tipado a partir del modelo ContractData
    contractDataForm: FormGroup<ControlsOf<ContractData>> = this.fb.group<ControlsOf<ContractData>>({
        printName: this.fb.control<string | null>(null),
        adminFee: this.fb.control<string | null>(null),
        cardIssueFee: this.fb.control<string | null>(null),
        reportsFee: this.fb.control<string | null>(null),
        accountingAccount: this.fb.control<string | null>(null),
        cfdiUsage: this.fb.control<string | null>(null),
        type: this.fb.control<string | null>(null),
        loyalty: this.fb.control<string | null>(null),
        percentage: this.fb.control<string | null>(null),
        rfcOrderingAccount: this.fb.control<string | null>(null),
        bank: this.fb.control<string | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            this.ngZone.run(() => {
                if (currentData) {
                    this.contractDataForm.patchValue(currentData, { emitEvent: false });
                } else {
                    // Soporte para time-travel / reset a estado inicial (create)
                    this.contractDataForm.reset({}, { emitEvent: false });
                    this.contractDataForm.markAsPristine();
                    this.contractDataForm.markAsUntouched();
                }
                // Forzar actualización inmediata tras time-travel
                this.cdr.detectChanges();
            });
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            const readonly = this.isReadonlyMode();
            
            this.ngZone.run(() => {
                if (busy || readonly) {
                    this.contractDataForm.disable({ emitEvent: false });
                } else {
                    this.contractDataForm.enable({ emitEvent: false });
                }
                // Forzar actualización inmediata tras time-travel
                this.cdr.detectChanges();
            });
        });

        // Form -> Store (cambios del form)
        this.contractDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.contractDataForm.getRawValue() as ContractData;
                this.store.dispatch(ContractDataPageActions.setData({ data }));
                this.store.dispatch(ContractDataPageActions.markAsDirty());
                this.cdr.detectChanges();
            });
    }

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(ContractDataPageActions.loadData({ customerId }));
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
        this.contractDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(ContractDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.contractDataForm.markAsPristine();
        this.contractDataForm.markAsUntouched();
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

    onSubmit(): void {
        this.saveData();
    }
}
