import { TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { contactForm } from '@/app/dashboard/customer/components/contacts/form';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { ContactsDataPageActions } from './ngrx/contacts.actions';
import { 
    selectContactsData, 
    selectContactsDataLoading, 
    selectContactsDataSaving, 
    selectContactsDataIsBusy,
    selectContactsDataError,
    selectContactsDataHasUnsavedChanges,
    selectContactsDataCanReset,
    selectContactsDataOriginal
} from './ngrx/contacts.selectors';
import { ContactsData } from './ngrx/contacts.models';
import { ContactData } from './ngrx/contacts.models';

export type ContactFormControl = {
    name: FormControl<string | null>;
    position: FormControl<string | null>;
    phone: FormControl<string | null>;
    email: FormControl<string | null>;
}

@Component({
    selector: 'app-contacts',
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent],
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.css'
})
export class ContactsComponent {
    readonly contactData = contactForm;
    readonly maxContacts = 3;
    
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);
    
    // NgRx signals
    isLoading = this.store.selectSignal(selectContactsDataLoading);
    isSaving = this.store.selectSignal(selectContactsDataSaving);
    isBusy = this.store.selectSignal(selectContactsDataIsBusy);
    error = this.store.selectSignal(selectContactsDataError);
    hasUnsavedChanges = this.store.selectSignal(selectContactsDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectContactsDataCanReset);
    data = this.store.selectSignal(selectContactsData);
    originalData = this.store.selectSignal(selectContactsDataOriginal);
    
    contactsForm: FormGroup = this.fb.group({
        contacts: this.fb.array([])
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            if (d) {
                this.contactsForm.patchValue(d, { emitEvent: false });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.contactsForm.reset({}, { emitEvent: false });
                this.contactsForm.markAsPristine();
                this.contactsForm.markAsUntouched();
            }
        });

        // Effect para manejar estado habilitado/deshabilitado del form
        effect(() => {
            const busy = this.isBusy();
            if (busy) {
                this.contactsForm.disable({ emitEvent: false });
            } else {
                this.contactsForm.enable({ emitEvent: false });
            }
        });

        // Form -> Store (cambios del form)
        this.contactsForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const data = this.contactsForm.getRawValue() as ContactsData;
                this.store.dispatch(ContactsDataPageActions.setData({ data }));
                this.store.dispatch(ContactsDataPageActions.markAsDirty());
            });
    }
    
    get contactsArray(): FormArray {
        return this.contactsForm.get('contacts') as FormArray;
    }
    
    createContactFormGroup(): FormGroup<ContactFormControl> {
        return this.fb.group({
            name: ['', []],
            position: ['', []],
            phone: ['', []],
            email: ['', []]
        });
    }

    addContact(): void {
        if (this.contactsArray.length < this.maxContacts) {
            this.contactsArray.push(this.createContactFormGroup());
        }
    }
    
    removeContact(index: number): void {
        if (this.canRemoveContact(index)) {
            this.contactsArray.removeAt(index);
        }
    }
    
    canAddContact(): boolean {
        return this.contactsArray.length < this.maxContacts;
    }
    
    canRemoveContact(index: number): boolean {
        return this.contactsArray.length > 1 && index > 0; // nunca eliminar el primero
    }

    // Cargar datos
    loadData(customerId: string): void {
        this.store.dispatch(ContactsDataPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const data = this.contactsForm.getRawValue() as ContactsData;
        this.store.dispatch(
            ContactsDataPageActions.saveData({
                customerId: customerId ?? 'temp',
                data
            })
        );
    }

    // Validación rápida con toast
    private assertValid(): boolean {
        if (this.contactsForm.valid) return true;
        this.toast.error('Formulario inválido. Revisa los campos requeridos.');
        this.contactsForm.markAllAsTouched();
        return false;
    }

    // Acciones varias
    resetForm(): void {
        this.store.dispatch(ContactsDataPageActions.resetForm());
        this.contactsForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.contactsForm.markAsPristine(); // Marca el form como pristine
        this.contactsForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(ContactsDataPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.contactsForm.markAsPristine();
        this.contactsForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(ContactsDataPageActions.markAsPristine());
        this.contactsForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(ContactsDataPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }

    trackByContact = (_i: number, ctrl: any) => ctrl;
}
