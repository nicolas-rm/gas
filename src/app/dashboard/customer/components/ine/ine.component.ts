import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { FileInputFieldComponent } from '@/components/file-input/file-input.component';
import { Component, inject, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ineForm } from '@/app/dashboard/customer/components/ine/form';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { IneDataPageActions } from './ngrx/ine.actions';
import { 
    selectIneData, 
    selectIneDataLoading, 
    selectIneDataSaving, 
    selectIneDataIsBusy,
    selectIneDataError,
    selectIneDataHasUnsavedChanges,
    selectIneDataCanReset,
    selectIneDataOriginal
} from './ngrx/ine.selectors';
import { IneData } from './ngrx/ine.models';

export type IneDataFormControl = {
    accountingKey: FormControl<string | null>;
    processType: FormControl<string | null>;
    committeeType: FormControl<string | null>;
    scope: FormControl<string | null>;
    document: FormControl<File | File[] | null>;
}

@Component({
  selector: 'app-ine',
  imports: [ReactiveFormsModule, TextFieldComponent, SelectFieldComponent, FileInputFieldComponent],
  templateUrl: './ine.component.html',
  styleUrl: './ine.component.css'
})
export class IneComponent {

    readonly ineData = ineForm

    readonly processTypeOptions = [
        { label: 'Proceso Electoral', value: 'electoral' },
        { label: 'Consulta Popular', value: 'consultation' },
        { label: 'Referéndum', value: 'referendum' },
        { label: 'Revocación de Mandato', value: 'revocation' }
    ]

    readonly committeeTypeOptions = [
        { label: 'Comité Local', value: 'local' },
        { label: 'Comité Distrital', value: 'district' },
        { label: 'Comité Estatal', value: 'state' },
        { label: 'Comité Nacional', value: 'national' }
    ]

    readonly scopeOptions = [
        { label: 'Federal', value: 'federal' },
        { label: 'Estatal', value: 'state' },
        { label: 'Municipal', value: 'municipal' },
        { label: 'Local', value: 'local' }
    ]

    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // NgRx signals
    isLoading = this.store.selectSignal(selectIneDataLoading);
    isSaving = this.store.selectSignal(selectIneDataSaving);
    isBusy = this.store.selectSignal(selectIneDataIsBusy);
    error = this.store.selectSignal(selectIneDataError);
    hasUnsavedChanges = this.store.selectSignal(selectIneDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectIneDataCanReset);
    data = this.store.selectSignal(selectIneData);
    originalData = this.store.selectSignal(selectIneDataOriginal);

    ineDataForm: FormGroup<IneDataFormControl>

    constructor() {
        this.ineDataForm = this.fb.group<IneDataFormControl>({
            accountingKey: this.fb.control<string | null>(null),
            processType: this.fb.control<string | null>(null),
            committeeType: this.fb.control<string | null>(null),
            scope: this.fb.control<string | null>(null),
            document: this.fb.control<File | File[] | null>(null),
        })

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
            if (busy) {
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

    // Cargar datos
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

    onSubmit() {
        this.saveData();
    }
}
