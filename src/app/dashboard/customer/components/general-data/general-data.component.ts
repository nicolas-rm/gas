import { SelectFieldComponent, TextFieldComponent } from '@/app/components/components';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { generalDataForm } from '@/app/dashboard/customer/components/general-data/form';

export type GeneralDataFormControl = {
    personType: FormControl<string | null>;
    groupType: FormControl<string | null>;
    rfc: FormControl<string | null>;
    businessName: FormControl<string | null>; // Razon social
    tradeName: FormControl<string | null>; // Nombre comercial
    street: FormControl<string | null>;
    exteriorNumber: FormControl<string | null>;
    interiorNumber: FormControl<string | null>;
    crossing: FormControl<string | null>; // Cruzamiento
    country: FormControl<string | null>;
    state: FormControl<string | null>;
    colony: FormControl<string | null>; // Colonia
    municipality: FormControl<string | null>;
    postalCode: FormControl<string | null>;
    phone: FormControl<string | null>;
    city: FormControl<string | null>;
    fax: FormControl<string | null>;
}

@Component({
    selector: 'app-general-data',
    imports: [ReactiveFormsModule, SelectFieldComponent, TextFieldComponent],
    templateUrl: './general-data.component.html',
    styleUrl: './general-data.component.css'
})
export class GeneralDataComponent {

    readonly generalData = generalDataForm

    readonly personTypeOptions = [
        { label: 'Persona Física', value: 'Persona Física' },
        { label: 'Persona Moral', value: 'Persona Moral' }
    ]
    private readonly fb = inject(FormBuilder);

    generalDataForm: FormGroup<GeneralDataFormControl>

    constructor() {
        this.generalDataForm = this.fb.group({
            personType: ['', []],
            groupType: ['', []],
            rfc: ['', []],
            tradeName: ['', []],
            businessName: ['', []],
            street: ['', []],
            exteriorNumber: ['', []],
            interiorNumber: ['', []],
            crossing: ['', []],
            country: ['', []],
            state: ['', []],
            colony: ['', []],
            municipality: ['', []],
            postalCode: ['', []],
            phone: ['', []],
            city: ['', []],
            fax: ['', []],
        })
    }

}
