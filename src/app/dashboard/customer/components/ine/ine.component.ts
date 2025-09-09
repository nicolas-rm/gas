// Angular
import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

// NgRx
import { Store } from '@ngrx/store';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes
import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Config del formulario (labels, ids, etc.)
import { ineForm } from '@/app/dashboard/customer/components/ine/form';

// NgRx INE Data
import { IneDataPageActions } from '@/dashboard/customer/components/ine/ngrx/ine.actions';
import { 
    selectIneData, 
    selectIneDataLoading, 
    selectIneDataSaving, 
    selectIneDataIsBusy,
    selectIneDataError,
    selectIneDataHasUnsavedChanges,
    selectIneDataCanReset,
    selectIneDataOriginal
} from '@/dashboard/customer/components/ine/ngrx/ine.selectors';
import { IneData } from '@/dashboard/customer/components/ine/ngrx/ine.models';

// Customer global state
import { selectIsReadonlyMode } from '@/app/dashboard/customer/ngrx';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
    selector: 'app-ine',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, SelectFieldComponent, FileInputFieldComponent],
    templateUrl: './ine.component.html',
    styleUrl: './ine.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IneComponent {

    // UI metadata (labels, placeholders…)
    readonly ineData = ineForm;

    readonly processTypeOptions = [
        { label: 'Proceso Electoral', value: 'electoral' },
        { label: 'Consulta Popular', value: 'consultation' },
        { label: 'Referéndum', value: 'referendum' },
        { label: 'Revocación de Mandato', value: 'revocation' }
    ];

    readonly committeeTypeOptions = [
        { label: 'Comité Local', value: 'local' },
        { label: 'Comité Distrital', value: 'district' },
        { label: 'Comité Estatal', value: 'state' },
        { label: 'Comité Nacional', value: 'national' }
    ];

    readonly scopeOptions = [
        { label: 'Federal', value: 'federal' },
        { label: 'Estatal', value: 'state' },
        { label: 'Municipal', value: 'municipal' },
        { label: 'Local', value: 'local' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectIneDataLoading);
    isSaving = this.store.selectSignal(selectIneDataSaving);
    isBusy = this.store.selectSignal(selectIneDataIsBusy);
    error = this.store.selectSignal(selectIneDataError);
    hasUnsavedChanges = this.store.selectSignal(selectIneDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectIneDataCanReset);
    data = this.store.selectSignal(selectIneData);
    originalData = this.store.selectSignal(selectIneDataOriginal);
    
    // Signal para modo readonly desde estado global
    isReadonlyMode = this.store.selectSignal(selectIsReadonlyMode);

    // FormGroup tipado a partir del modelo IneData
    ineDataForm: FormGroup<ControlsOf<IneData>> = this.fb.group<ControlsOf<IneData>>({
        accountingKey: this.fb.control<string | null>(null),
        processType: this.fb.control<string | null>(null),
        committeeType: this.fb.control<string | null>(null),
        scope: this.fb.control<string | null>(null),
        document: this.fb.control<File | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.ineDataForm.patchValue(currentData, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.ineDataForm.reset({}, { emitEvent: false });
                this.ineDataForm.markAsPristine();
                this.ineDataForm.markAsUntouched();
            }
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            const readonly = this.isReadonlyMode();
            
            if (busy || readonly) {
                this.ineDataForm.disable({ emitEvent: false });
            } else {
                this.ineDataForm.enable({ emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.ineDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.ineDataForm.getRawValue() as IneData;
                this.store.dispatch(IneDataPageActions.setData({ data }));
                this.store.dispatch(IneDataPageActions.markAsDirty());
            });
    }

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(IneDataPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.ineDataForm.getRawValue() as IneData;
        this.store.dispatch(
            IneDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.ineDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.ineDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(IneDataPageActions.resetForm());
        this.ineDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.ineDataForm.markAsPristine(); // Marca el form como pristine
        this.ineDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(IneDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.ineDataForm.markAsPristine();
        this.ineDataForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(IneDataPageActions.markAsPristine());
        this.ineDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(IneDataPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }
}
