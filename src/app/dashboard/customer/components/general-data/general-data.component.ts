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
import { generalDataForm } from '@/app/dashboard/customer/components/general-data/form';

// NgRx General Data
import { GeneralDataPageActions } from '@/dashboard/customer/components/general-data/ngrx/general-data.actions';
import {
    selectGeneralData,
    selectGeneralDataOriginal,
    selectGeneralDataIsBusy,
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    selectGeneralDataError,
    selectGeneralDataHasUnsavedChanges,
    selectGeneralDataCanReset
} from '@/dashboard/customer/components/general-data/ngrx/general-data.selectors';
import { GeneralData } from '@/dashboard/customer/components/general-data/ngrx/general-data.models';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };

@Component({
    selector: 'app-general-data',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectFieldComponent, TextFieldComponent],
    templateUrl: './general-data.component.html',
    styleUrl: './general-data.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralDataComponent {

    // UI metadata (labels, placeholders…)
    readonly generalData = generalDataForm;

    readonly personTypeOptions = [
        { label: 'Persona Física', value: 'Persona Física' },
        { label: 'Persona Moral', value: 'Persona Moral' }
    ];

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // Signals desde NgRx (ya los tenías)
    isLoading = this.store.selectSignal(selectGeneralDataLoading);
    isSaving = this.store.selectSignal(selectGeneralDataSaving);
    isBusy = this.store.selectSignal(selectGeneralDataIsBusy);
    error = this.store.selectSignal(selectGeneralDataError);
    hasUnsavedChanges = this.store.selectSignal(selectGeneralDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectGeneralDataCanReset);
    data = this.store.selectSignal(selectGeneralData);
    originalData = this.store.selectSignal(selectGeneralDataOriginal);
    // formState selector removido tras simplificación

    // FormGroup tipado a partir de tu modelo GeneralData
    generalDataForm: FormGroup<ControlsOf<GeneralData>> = this.fb.group<ControlsOf<GeneralData>>({
        personType: this.fb.control<string | null>(null, ReactiveValidators.required),
        groupType: this.fb.control<string | null>(null, ReactiveValidators.required),
        rfc: this.fb.control<string | null>(null),
        tradeName: this.fb.control<string | null>(null),
        businessName: this.fb.control<string | null>(null),
        street: this.fb.control<string | null>(null),
        exteriorNumber: this.fb.control<string | null>(null),
        interiorNumber: this.fb.control<string | null>(null),
        crossing: this.fb.control<string | null>(null),
        country: this.fb.control<string | null>(null),
        state: this.fb.control<string | null>(null),
        colony: this.fb.control<string | null>(null),
        municipality: this.fb.control<string | null>(null),
        postalCode: this.fb.control<string | null>(null),
        phone: this.fb.control<string | null>(null),
        city: this.fb.control<string | null>(null),
        fax: this.fb.control<string | null>(null),
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            if (d) {
                this.generalDataForm.patchValue(d, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.generalDataForm.reset({}, { emitEvent: false });
                this.generalDataForm.markAsPristine();
                this.generalDataForm.markAsUntouched();
            }
        });

        // Form -> Store (cambios del form)
        this.generalDataForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.generalDataForm.getRawValue() as GeneralData;
                this.store.dispatch(GeneralDataPageActions.setData({ data }));
                this.store.dispatch(GeneralDataPageActions.markAsDirty());
            });
    }

    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(GeneralDataPageActions.loadData({ customerId }));
    }

    // (Eliminado updateField granular; ahora todo se maneja vía setData)

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.generalDataForm.getRawValue() as GeneralData;
        this.store.dispatch(
            GeneralDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.generalDataForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.generalDataForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(GeneralDataPageActions.resetForm());
        this.generalDataForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.generalDataForm.markAsPristine(); // Marca el form como pristine
        this.generalDataForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(GeneralDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.generalDataForm.markAsPristine();
        this.generalDataForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(GeneralDataPageActions.markAsPristine());
        this.generalDataForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(GeneralDataPageActions.clearErrors());
    }

    // Guardado de cambios antes de salir
    // canDeactivate eliminado; se implementará mediante un guard dedicado si se requiere en el futuro

    onSubmit(): void {
        this.saveData();
    }
}
