// Angular
import { Component, ChangeDetectionStrategy, inject, effect, ChangeDetectorRef, NgZone } from '@angular/core';
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
import { ContactsDataPageActions } from '@/dashboard/customer/components/contacts/ngrx/contacts.actions';
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

// Customer global state
import { selectIsReadonlyMode } from '@/app/dashboard/customer/ngrx';

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
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    // Signals desde NgRx
    isLoading = this.store.selectSignal(selectContactsDataLoading);
    isSaving = this.store.selectSignal(selectContactsDataSaving);
    isBusy = this.store.selectSignal(selectContactsDataIsBusy);
    error = this.store.selectSignal(selectContactsDataError);
    hasUnsavedChanges = this.store.selectSignal(selectContactsDataHasUnsavedChanges);
    canReset = this.store.selectSignal(selectContactsDataCanReset);
    data = this.store.selectSignal(selectContactsData);
    originalData = this.store.selectSignal(selectContactsDataOriginal);
    
    // Signal para modo readonly desde estado global
    isReadonlyMode = this.store.selectSignal(selectIsReadonlyMode);

    // FormGroup tipado (FormArray requiere tipado menos estricto para Angular)
    contactsForm: FormGroup = this.fb.group({
        contacts: this.fb.array([])
    });

    constructor() {
        // Store -> Form (se ejecuta cada vez que cambie el signal)
        effect(() => {
            const d = this.data();
            this.ngZone.run(() => {
                const arr = this.contactsForm.get('contacts') as FormArray;
                
                if (d && Array.isArray(d.contacts)) {
                    // Solo reconstruir si la estructura es diferente o viene de carga inicial
                    const currentContacts = arr.controls.map(ctrl => ctrl.getRawValue());
                    const needsSync = currentContacts.length !== d.contacts.length || 
                                     JSON.stringify(currentContacts) !== JSON.stringify(d.contacts);
                    
                    if (needsSync) {
                        // Sincroniza el array de contactos sin emitir eventos
                        arr.clear({ emitEvent: false });
                        d.contacts.forEach(contact => {
                            arr.push(this.createContactFormGroup(contact), { emitEvent: false });
                        });
                    }
                } else {
                    // Soporte para time-travel / reset a estado inicial (create)
                    if (arr.length > 0) {
                        this.contactsForm.reset({}, { emitEvent: false });
                        arr.clear({ emitEvent: false });
                        this.contactsForm.markAsPristine();
                        this.contactsForm.markAsUntouched();
                    }
                    // Asegurar que siempre haya al menos un contacto vacío
                    if (arr.length === 0) {
                        arr.push(this.createContactFormGroup(), { emitEvent: false });
                    }
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
                    this.contactsForm.disable({ emitEvent: false });
                } else {
                    this.contactsForm.enable({ emitEvent: false });
                }
                // Forzar actualización inmediata tras time-travel
                this.cdr.detectChanges();
            });
        });

        // Form -> Store (cambios del form)
        this.contactsForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed())
            .subscribe(() => {
                const arr = this.contactsForm.get('contacts') as FormArray;
                const contacts: ContactData[] = arr.controls.map((ctrl: any) => ctrl.getRawValue() as ContactData);
                this.store.dispatch(ContactsDataPageActions.setData({ data: { contacts } }));
                this.store.dispatch(ContactsDataPageActions.markAsDirty());
                this.cdr.detectChanges();
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
            position: this.fb.control<string | null>(contact?.position ?? '', [ReactiveValidators.required]),
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
        this.store.dispatch(ContactsDataPageActions.loadData({ customerId }));
    }

    // Guardar
    saveData(customerId?: string): void {
        if (!this.assertValid()) return;
        const allContacts: ContactData[] = this.contactsArray.controls.map((ctrl: any) => ctrl.getRawValue() as ContactData);
        // Filtrar contactos vacíos antes de guardar
        const contacts = allContacts.filter(contact => !isEmptyContact(contact));
        
        this.store.dispatch(
            ContactsDataPageActions.saveData({
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
        this.store.dispatch(ContactsDataPageActions.resetForm());
        this.contactsForm.reset({}, { emitEvent: false }); // Evita que se dispare valueChanges
        this.contactsForm.markAsPristine(); // Marca el form como pristine
        this.contactsForm.markAsUntouched();
        this.contactsArray.clear();
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
