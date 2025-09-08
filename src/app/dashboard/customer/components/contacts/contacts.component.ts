import { TextFieldComponent } from '@/app/components/components';
import { Component, inject, effect } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { contactForm } from '@/app/dashboard/customer/components/contacts/form';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, map, skip } from 'rxjs/operators';
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
    
    contactsForm: FormGroup;

    // Control de hidrata / inicialización silenciosa
    private hydrating = false;

    // ==== Normalización y utilidades ====
    private toStr = (v: any) => (v == null ? '' : String(v).trim());
    private isEmptyContact = (c: ContactData | null | undefined) =>
        !c || (!this.toStr(c.name) && !this.toStr(c.position) && !this.toStr(c.phone) && !this.toStr(c.email));

    private normalize = (d: ContactsData | null | undefined): ContactsData => ({
        contacts: (d?.contacts ?? [])
            .filter(c => !this.isEmptyContact(c))
            .map(c => ({
                name: c?.name ?? null,
                position: c?.position ?? null,
                phone: c?.phone ?? null,
                email: c?.email ?? null,
            })),
    });

    private deepEq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
    
    constructor() {
        this.contactsForm = this.fb.group({
            contacts: this.fb.array([])
        });

        // Añadir fila inicial silenciosa (placeholder) sin ensuciar
        this.addBlankContactSilent();

        // Store -> Form (reactivo a cambios del store)
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                // Nuevo patrón rebuild
                const norm = this.normalize(currentData);
                this.rebuildContacts(norm.contacts);
            } else {
                // Modo creación / reset total
                this.hydrating = true;
                try {
                    this.contactsArray.clear();
                    this.addBlankContactSilent();
                    this.contactsForm.markAsPristine();
                    this.contactsForm.markAsUntouched();
                } finally {
                    this.hydrating = false;
                }
            }
        });

        // Effect: habilitar / deshabilitar
        effect(() => {
            const busy = this.isBusy();
            if (busy) {
                this.contactsForm.disable({ emitEvent: false });
            } else {
                this.contactsForm.enable({ emitEvent: false });
            }
        });

        this.wireFormChanges();
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

    private rebuildContacts(contacts: ContactData[]): void {
        this.hydrating = true;
        try {
            const arr = this.contactsArray;
            if (typeof (arr as any).clear === 'function') {
                (arr as any).clear({ emitEvent: false });
            } else {
                while (arr.length) arr.removeAt(arr.length - 1, { emitEvent: false } as any);
            }
            if (!contacts.length) {
                arr.push(this.createContactFormGroup(), { emitEvent: false });
            } else {
                contacts.forEach(c => arr.push(this.createContactFormGroup(), { emitEvent: false }));
                // Patch de valores ahora que tamaños coinciden
                this.contactsForm.patchValue({ contacts }, { emitEvent: false });
            }
            this.contactsForm.markAsPristine();
        } finally {
            this.hydrating = false;
        }
    }

    // Listener avanzado de cambios del formulario
    private wireFormChanges() {
        this.contactsForm.valueChanges.pipe(
            // Ignorar la primera emisión (construcción inicial)
            skip(1),
            debounceTime(300),
            filter(() => !this.hydrating),
            map(() => this.normalize(this.contactsForm.getRawValue() as ContactsData)),
            distinctUntilChanged((a, b) => this.deepEq(a, b)),
            takeUntilDestroyed()
        ).subscribe(value => {
            // Sincronizar siempre data normalizada
            this.store.dispatch(ContactsDataPageActions.setData({ data: value }));

            // Comparar contra original normalizado para dirty/pristine
            const orig = this.normalize(this.originalData() ?? { contacts: [] });
            if (!this.deepEq(value, orig)) {
                this.store.dispatch(ContactsDataPageActions.markAsDirty());
            } else {
                this.store.dispatch(ContactsDataPageActions.markAsPristine());
            }
        });
    }

    // Agregar fila inicial silenciosa
    private addBlankContactSilent() {
        this.hydrating = true;
        try {
            this.contactsArray.push(this.createContactFormGroup());
            this.contactsForm.updateValueAndValidity({ emitEvent: false });
            this.contactsForm.markAsPristine();
        } finally {
            this.hydrating = false;
        }
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
        this.rebuildContacts([]); // vacía y deja una fila
        this.contactsForm.markAsPristine();
        this.contactsForm.markAsUntouched();
    }

    // Restablecer a datos originales (crear: vacío, actualizar: datos cargados)
    resetToOriginal(): void {
        const orig = this.normalize(this.originalData() ?? { contacts: [] });
        this.rebuildContacts(orig.contacts);
        this.store.dispatch(ContactsDataPageActions.setData({ data: orig }));
        this.store.dispatch(ContactsDataPageActions.markAsPristine());
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
