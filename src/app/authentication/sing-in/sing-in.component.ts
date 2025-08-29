import { TextFieldComponent } from '@/app/components/components';
import { ReactiveValidators } from '@/app/utils/ReactiveValidators';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-sing-in',
    imports: [TextFieldComponent, ReactiveFormsModule],
    templateUrl: './sing-in.component.html',
    styleUrl: './sing-in.component.css'
})
export class SingInComponent {

    loginForm: FormGroup;

    constructor(private readonly fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [ReactiveValidators.required, ReactiveValidators.email]],
            password: ['', [ReactiveValidators.required, ReactiveValidators.minLength(8)]],
            // rememberMe: [false]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Form is valid');
        } else {
            console.log('Form is invalid');
        }
    }
}
