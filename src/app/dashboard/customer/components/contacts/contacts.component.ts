// Angular
import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// NgRx
import { Store } from '@ngrx/store';

// RxJS
import { debounceTime } from 'rxjs/operators';

// Componentes
import { TextFieldComponent } from '@/app/components/components';

// Config del formulario (labels, ids, etc.)
import { contactForm } from '@/app/dashboard/customer/components/contacts/form';

// NgRx Contacts
import { ContactsPageActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
import {
    selectContactsData,
    selectContactsDataOriginal,
    selectContactsDataIsBusy,
    selectContactsDataLoading,
    selectContactsDataSaving,
    selectContactsDataError,
    selectContactsDataHasUnsavedChanges,
    selectContactsDataCanReset,
    isEmptyContact
} from '@/dashboard/customer/components/contacts/ngrx/contacts.selectors';
import { ContactsData, ContactData } from '@/dashboard/customer/components/contacts/ngrx/contacts.models';

// Validadores
import { ReactiveValidators } from '@/app/utils/validators/ReactiveValidators';

// Toasts
import { HotToastService } from '@ngxpert/hot-toast';

type ControlsOf<T> = { [K in keyof T]: FormControl<T[K] | null> };
export type ContactFormControl = ControlsOf<ContactData>;

@Component({
    selector: 'app-contacts',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent],
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent {

    // UI metadata (labels, placeholders…)
    readonly contactData = contactForm;
    readonly maxContacts = 3;

    // Inyecciones
    private readonly fb = inject(FormBuilder);
    private readonly toast = inject(HotToastService);
    private readonly store = inject(Store);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectContactsDataLoading);
    isSaving = this.store.selectSignal(selectContactsDataSaving);
    isBusy = this.store.selectSignal(selectContactsDataIsBusy);
    error = this.store.selectSignal(selectContactsDataError);
    hasUnsavedChanges = this.store.selectSignal(selectContactsDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectContactsDataCanReset);
    data = this.store.selectSignal(selectContactsData);
    originalData = this.store.selectSignal(selectContactsDataOriginal);

    // FormGroup tipado (FormArray requiere tipado menos estricto para Angular)
    contactsForm: FormGroup = this.fb.group({
        contacts: this.fb.array([])
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            if (d && Array.isArray(d.contacts)) {
                // Sincroniza el array de contactos
                const arr = this.contactsForm.get('contacts') as FormArray;
                arr.clear();
                d.contacts.forEach(contact => {
                    arr.push(this.createContactFormGroup(contact));
                });
            } else {
                // Soporte para time-travel / reset a estado inicial (create)
                this.contactsForm.reset({}, { emitEvent: false });
                (this.contactsForm.get('contacts') as FormArray).clear();
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
                const arr = this.contactsForm.get('contacts') as FormArray;
                const contacts: ContactData[] = arr.controls.map((ctrl: any) => ctrl.getRawValue() as ContactData);
                this.store.dispatch(ContactsPageActions.setData({ data: { contacts } }));
                this.store.dispatch(ContactsPageActions.markAsDirty());
            });
    }

    // === Getters ===
    get contactsArray(): FormArray {
        return this.contactsForm.get('contacts') as FormArray;
    }

    // === Métodos de contacto ===
    createContactFormGroup(contact?: ContactData): FormGroup<ContactFormControl> {
        return this.fb.group({
            name: this.fb.control<string | null>(contact?.name ?? '', [ReactiveValidators.required]),
            position: this.fb.control<string | null>(contact?.position ?? '', []),
            phone: this.fb.control<string | null>(contact?.phone ?? '', [ReactiveValidators.required]),
            email: this.fb.control<string | null>(contact?.email ?? '', [ReactiveValidators.required, ReactiveValidators.email])
        });
    }

    addContact(): void {
        if (this.contactsArray.length < this.maxContacts) {
            // Agregar contacto sin emitir evento para evitar marcar como dirty
            this.contactsArray.push(this.createContactFormGroup(), { emitEvent: false });
        }
    }

    removeContact(index: number): void {
        if (this.canRemoveContact(index)) {
            // Verificar si el contacto está vacío para decidir si emitir evento
            const contactValue = this.contactsArray.at(index)?.getRawValue() as ContactData;
            const isDraft = isEmptyContact(contactValue);
            this.contactsArray.removeAt(index, { emitEvent: !isDraft });
        }
    }

    canAddContact(): boolean {
        return this.contactsArray.length < this.maxContacts;
    }

    canRemoveContact(index: number): boolean {
        return this.contactsArray.length > 1 && index > 0; // nunca eliminar el primero
    }

    // === Acciones principales ===
    // Cargar datos desde API
    loadData(customerId: string): void {
        this.store.dispatch(ContactsPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const allContacts: ContactData[] = this.contactsArray.controls.map((ctrl: any) => ctrl.getRawValue() as ContactData);
        // Filtrar contactos vacíos antes de guardar
        const contacts = allContacts.filter(contact => !isEmptyContact(contact));
        
        this.store.dispatch(
            ContactsPageActions.saveData({
                customerId: customerId ?? 'temp',
                data: { contacts }
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

    // === Acciones varias ===
    resetForm(): void {
        this.store.dispatch(ContactsPageActions.resetForm());
        this.contactsForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.contactsForm.markAsPristine(); // Marca el form como pristine
        this.contactsForm.markAsUntouched();
        this.contactsArray.clear();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        this.store.dispatch(ContactsPageActions.resetToOriginal());
        // El efecto se encargará de actualizar el formulario con los datos originales
        this.contactsForm.markAsPristine();
        this.contactsForm.markAsUntouched();
    }

    // Marcar como pristine (sin cambios)
    markAsPristine(): void {
        this.store.dispatch(ContactsPageActions.markAsPristine());
        this.contactsForm.markAsPristine();
    }

    // Limpiar errores
    clearErrors(): void {
        this.store.dispatch(ContactsPageActions.clearErrors());
    }

    onSubmit(): void {
        this.saveData();
    }

    trackByContact = (_i: number, ctrl: any) => ctrl;
}
