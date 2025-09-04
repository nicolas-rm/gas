import { TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { contactForm } from '@/app/dashboard/customer/components/contacts/form';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';

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
    
    contactsForm: FormGroup;
    
    constructor() {
        this.contactsForm = this.fb.group({
            contacts: this.fb.array([])
        });
        
        // Agregar un contacto inicial
        this.addContact();
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

    onSubmit() {
        if (this.contactsForm.valid) {
            this.toast.success('Formulario de Contactos válido');
        }

        if (this.contactsForm.invalid) {
            this.toast.error('Formulario de Contactos invalido, Favor de revisar los campos requeridos.');
            this.contactsForm.markAllAsTouched();
        }
    }
}
