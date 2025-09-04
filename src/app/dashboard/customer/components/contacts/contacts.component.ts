import { TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { contactForm } from '@/app/dashboard/customer/components/contacts/form';
import { CommonModule } from '@angular/common';

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

        // Agregar una referencia inicial
        this.addContact();
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
}
