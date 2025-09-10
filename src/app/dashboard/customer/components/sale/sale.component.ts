// Angular
import { Component, inject, effect, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
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
import { saleForm } from '@/app/dashboard/customer/components/sale/form';

// NgRx Sale Data
import { SaleDataPageActions } from './ngrx/sale.actions';
import { 
    selectSaleData, 
    selectSaleDataLoading, 
    selectSaleDataSaving, 
    selectSaleDataIsBusy,
    selectSaleDataError,
    selectSaleDataHasUnsavedChanges,
    selectSaleDataCanReset,
    selectSaleDataOriginal
} from './ngrx/sale.selectors';
import { SaleData } from './ngrx/sale.models';

// Customer global state
import { selectIsReadonlyMode } from '@/app/dashboard/customer/ngrx';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectFieldComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleComponent {

    // UI metadata (labels, placeholders…)
    readonly saleData = saleForm;

    readonly accountTypeOptions = [
        { label: 'Prepago', value: 'prepago' },
        { label: 'Crédito', value: 'credito' },
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Control', value: 'control' }
    ];

    readonly prepaidTypeOptions = [
        { label: 'Cuenta Maestra', value: 'cuenta_maestra' },
        { label: 'Por Tarjetas', value: 'por_tarjetas' }
    ];

    readonly paymentMethodOptions = [
        { label: 'Transferencia Bancaria', value: 'transferencia' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
        { label: 'Tarjeta de Débito', value: 'tarjeta_debito' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectSaleDataLoading);
    isSaving = this.store.selectSignal(selectSaleDataSaving);
    isBusy = this.store.selectSignal(selectSaleDataIsBusy);
    error = this.store.selectSignal(selectSaleDataError);
    hasUnsavedChanges = this.store.selectSignal(selectSaleDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectSaleDataCanReset);
    data = this.store.selectSignal(selectSaleData);
    originalData = this.store.selectSignal(selectSaleDataOriginal);
    
    // Signal para modo readonly desde estado global
    isReadonlyMode = this.store.selectSignal(selectIsReadonlyMode);

    // FormGroup tipado a partir del modelo SaleData
    saleDataForm: FormGroup<ControlsOf<SaleData>> = this.fb.group<ControlsOf<SaleData>>({
        accountType: this.fb.control<string | null>(null),
        seller: this.fb.control<string | null>(null),
        accountNumber: this.fb.control<string | null>(null),
        prepaidType: this.fb.control<string | null>(null),
        creditDays: this.fb.control<string | null>(null),
        creditLimit: this.fb.control<string | null>(null),
        advanceCommission: this.fb.control<string | null>(null),
        paymentMethod: this.fb.control<string | null>(null),
        voucherAmount: this.fb.control<string | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            this.ngZone.run(() => {
                if (currentData) {
                    this.saleDataForm.patchValue(currentData, { emitEvent: false });
                } else {
                    // Soporte para time-travel / reset a estado inicial (create)
                    this.saleDataForm.reset({}, { emitEvent: false });
                    this.saleDataForm.markAsPristine();
                    this.saleDataForm.markAsUntouched();
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
                    this.saleDataForm.disable({ emitEvent: false });
                } else {
                    this.saleDataForm.enable({ emitEvent: false });
                }
                // Forzar actualización inmediata tras time-travel
                this.cdr.detectChanges();
            });
        });

        // Form -> Store (cambios del form)
        this.saleDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.saleDataForm.getRawValue() as SaleData;
                this.store.dispatch(SaleDataPageActions.setData({ data }));
                this.store.dispatch(SaleDataPageActions.markAsDirty());
                this.cdr.detectChanges();
            });
    }

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(SaleDataPageActions.loadData({ customerId }));
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
        this.saleDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(SaleDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.saleDataForm.markAsPristine();
        this.saleDataForm.markAsUntouched();
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

    onSubmit(): void {
        this.saveData();
    }
}
