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
    
    contactsForm: FormGroup;
    
    constructor() {
        this.contactsForm = this.fb.group({
            contacts: this.fb.array([])
        });
        
        // Agregar un contacto inicial
        this.addContact();

        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                // Sincronizar FormArray con datos del store
                this.syncFormArrayWithData(currentData);
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.contactsArray.clear();
                this.addContact();
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

    // Sincronizar FormArray con datos del store
    private syncFormArrayWithData(data: ContactsData): void {
        const currentLength = this.contactsArray.length;
        const dataLength = data.contacts ? data.contacts.length : 0;

        // Ajustar tamaño del FormArray
        if (dataLength > currentLength) {
            for (let i = currentLength; i < dataLength; i++) {
                this.contactsArray.push(this.createContactFormGroup());
            }
        } else if (dataLength < currentLength) {
            for (let i = currentLength - 1; i >= dataLength; i--) {
                this.contactsArray.removeAt(i);
            }
        }

        // Actualizar valores
        this.contactsForm.patchValue(data, { emitEvent: false });
    }
    
    addContact(): void {
        if (this.contactsArray.length < this.maxContacts) {
            this.contactsArray.push(this.createContactFormGroup());
        }
    }
    
    removeContact(index: number): void {
        if (this.contactsArray.length > 1) {
            this.contactsArray.removeAt(index);
        }
    }
    
    canAddContact(): boolean {
        return this.contactsArray.length < this.maxContacts;
    }
    
    canRemoveContact(): boolean {
        return this.contactsArray.length > 1;
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
        this.contactsArray.clear();
        this.addContact(); // Agregar contacto inicial
        this.contactsForm.markAsPristine();
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
}
