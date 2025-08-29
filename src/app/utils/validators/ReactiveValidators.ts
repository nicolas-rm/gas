import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ReactiveValidators {
    /**
     * Validación de la contraseña con mayúsculas, minúsculas y números.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no cumple los requisitos de seguridad o null si es válida.
     */
    static passwordStrength(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);
        const hasLowerCase = /[a-z]+/.test(value);
        const hasNumeric = /[0-9]+/.test(value);
        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        return !passwordValid ? { passwordStrength: { message: 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número.' } } : null;
    }

    /**
     * Validación de coincidencia de contraseñas.
     * @param controlName - Nombre del control de la primera contraseña.
     * @param matchingControlName - Nombre del control de la segunda contraseña.
     * @returns ValidationErrors | null - Error si las contraseñas no coinciden o null si coinciden.
     */
    static match(this: void, controlName: string, matchingControlName: string) {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);

            if (!control || !matchingControl) {
                return null;
            }

            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return null;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: { message: 'Las contraseñas no coinciden.' } });
            } else {
                matchingControl.setErrors(null);
            }

            return null;
        };
    }

    /**
     * Validación del correo electrónico.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el correo no es válido o null si es válido.
     */
    static email(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value);
        return !valid ? { email: { message: 'El correo electrónico no es válido.' } } : null;
    }

    /**
     * Validación de solo letras.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son letras o null si es válido.
     */
    static letters(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-zA-Z]+$/.test(value);
        return !valid ? { letters: { message: 'Solo se permiten letras.' } } : null;
    }

    /**
     * Validación de solo letras y espacios.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son letras o espacios o null si es válido.
     */
    static lettersWithSpaces(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-zA-Z\s]+$/.test(value);
        return !valid ? { lettersWithSpaces: { message: 'Solo se permiten letras y espacios.' } } : null;
    }

    /**
     * Validación de solo letras, números y espacios.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son letras, números o espacios o null si es válido.
     */
    static alphanumericWithSpaces(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-zA-Z0-9\s]+$/.test(value);
        return !valid ? { alphanumericWithSpaces: { message: 'Solo se permiten letras, números y espacios.' } } : null;
    }

    /**
     * Validación de solo letras, números, espacios y guiones.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son letras, números, espacios o guiones o null si es válido.
     */
    static alphanumericWithSpacesAndHyphens(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-zA-Z0-9\s-]+$/.test(value);
        return !valid ? { alphanumericWithSpacesAndHyphens: { message: 'Solo se permiten letras, números, espacios y guiones.' } } : null;
    }

    /**
     * Validación de solo letras, números, espacios y puntos.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son letras, números, espacios o puntos o null si es válido.
     */
    static alphanumericWithSpacesAndDots(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[a-zA-Z0-9\s.]+$/.test(value);
        return !valid ? { alphanumericWithSpacesAndDots: { message: 'Solo se permiten letras, números, espacios y puntos.' } } : null;
    }

    /**
     * Validación de solo numeros y decimales.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son números o decimales o null si
     */
    static number(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[0-9]+(\.[0-9]+)?$/.test(value);
        return !valid ? { number: { message: 'Solo se permiten números y decimales.' } } : null;
    }

    /**
     * Validación del CURP.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el CURP no es válido o null si es válido.
     */
    static curp(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value?.trim() || ''; // Eliminar espacios al principio y final
        if (!value) {
            return null; // Si no hay valor, no se valida
        }

        // Expresión regular de validación para CURP
        const valid = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(value);

        // Devolver el error si el CURP no es válido
        return !valid ? { curp: { message: 'El CURP no es válido.' } } : null;
    }

    /**
     * Validación del RFC. fisico o moral
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el RFC no es válido o null si es válido.
     */
    static rfc(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }
        // Expresión regular para validar RFC de personas físicas
        const rfcFisicoRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
        // Expresión regular para validar RFC de personas morales
        // const rfcMoralRegex = /^[A-Z&Ñ]{3}[0-9]{6}[A-Z0-9]{3}$/;
        // Validar si el RFC coincide con alguno de los dos formatos
        const isValidFisico = rfcFisicoRegex.test(value);
        // Si no es válido ni físico ni moral, retornamos el error
        if (!isValidFisico) {
            return { rfc: { message: 'El RFC no es válido.' } };
        }
        // Si pasa la validación, retornamos null
        return null;
    }

    /**
     * Validación del número de teléfono.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el número no tiene 10 dígitos o null si es válido.
     */
    static phone(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[0-9]{10}$/.test(value);
        return !valid ? { phone: { message: 'El número de teléfono debe tener 10 dígitos.' } } : null;
    }

    /**
     * Validación del código postal.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el código postal no tiene 5 dígitos o null si es válido.
     */
    static postalCode(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[0-9]{5}$/.test(value);
        return !valid ? { postalCode: { message: 'El código postal debe tener 5 dígitos.' } } : null;
    }

    /**
     * Validación de solo dígitos.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no son dígitos o null si es válido.
     */
    static digits(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return null;
        }

        const valid = /^[0-9]+$/.test(value);
        return !valid ? { digits: { message: 'Solo se permiten dígitos.' } } : null;
    }

    /**
     * Validación del valor mínimo.
     * @param min - Valor mínimo permitido.
     * @returns ValidationErrors | null - Error si el valor es menor al mínimo o null si es válido.
     */
    static min(this: void, min: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || 0;
            if (!value) {
                return null;
            }

            return value < min ? { min: { message: `El valor debe ser al menos ${min}.` } } : null;
        };
    }

    /**
     * Validación del valor máximo.
     * @param max - Valor máximo permitido.
     * @returns ValidationErrors | null - Error si el valor es mayor al máximo o null si es válido.
     */
    static max(this: void, max: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || 0;
            if (!value) {
                return null;
            }

            return value > max ? { max: { message: `El valor no puede ser mayor a ${max}.` } } : null;
        };
    }

    /**
     * Validación de la longitud mínima.
     * @param minLength - Longitud mínima permitida.
     * @returns ValidationErrors | null - Error si la longitud es menor o null si es válida.
     */
    static minLength(this: void, minLength: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';
            if (!value) {
                return null;
            }

            return value.length < minLength ? { minLength: { message: `La longitud mínima es de ${minLength} caracteres.` } } : null;
        };
    }

    /**
     * Validación de la longitud máxima.
     * @param maxLength - Longitud máxima permitida.
     * @returns ValidationErrors | null - Error si la longitud es mayor o null si es válida.
     */
    static maxLength(this: void, maxLength: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';
            if (!value) {
                return null;
            }

            return value.length > maxLength ? { maxLength: { message: `La longitud máxima es de ${maxLength} caracteres.` } } : null;
        };
    }

    /**
     * Validación de la longitud exacta.
     * @param length - Longitud exacta requerida.
     * @returns ValidationErrors | null - Error si la longitud no es exacta o null si es válida.
     */
    static length(this: void, length: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';
            if (!value) {
                return null;
            }

            return value.length !== length ? { length: { message: `La longitud debe ser de ${length} caracteres.` } } : null;
        };
    }

    /**
     * Validación de campo requerido.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el campo está vacío o null si es válido.
     */
    static required(this: void, control: AbstractControl): ValidationErrors | null {
        const value = control.value || '' || 0;
        if (!value) {
            return { required: { message: 'Este campo es requerido.' } };
        }

        return null;
    }

    /**
     * Validación de selección de fecha.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no se seleccionó una fecha o null si es válida.
     */
    static date(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { date: { message: 'Selecciona una fecha.' } };
        }

        return null;
    }

    /**
     * Validación de selección de fecha futura.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si la fecha no es futura o null si es válida.
     */
    static futureDate(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { futureDate: { message: 'Selecciona una fecha futura.' } };
        }

        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate < today ? { futureDate: { message: 'Selecciona una fecha futura.' } } : null;
    }

    /**
     * Validación de selección de fecha pasada.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si la fecha no es pasada o null si es válida.
     */
    static pastDate(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { pastDate: { message: 'Selecciona una fecha pasada.' } };
        }

        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate > today ? { pastDate: { message: 'Selecciona una fecha pasada.' } } : null;
    }

    /**
     * Validación de mayor de edad.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si la persona no es mayor de edad o null si es válida.
     */
    static adult(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { adult: { message: 'Debes ser mayor de edad.' } };
        }

        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        return age < 18 ? { adult: { message: 'Debes ser mayor de edad.' } } : null;
    }

    /**
     * Validación de menor de edad.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si la persona no es menor de edad o null si es válida.
     */
    static minor(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { required: { message: 'Este campo es requerido' } };
        }

        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        return age >= 18 ? { minor: { message: 'Debes ser menor de edad.' } } : null;
    }

    /**
     * Validación de un campo select/autocomplete para verificar que la opción no sea la predeterminada.
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si no se selecciona una opción válida o null si es válida.
     */
    static select(this: void, control: AbstractControl): ValidationErrors | null {
        const value: string = control.value || '';
        if (!value) {
            return { select: { message: 'Selecciona una opción.' } };
        }

        return null;
    }

    /**
     * Validación de una opción seleccionada que esté en la lista de opciones, por defecto valida el required
     * @param options - Lista de opciones permitidas.
     * @required - Opción requerida.
     * @returns ValidationErrors | null - Error si la opción seleccionada no está en la lista o null si es válida.
     * @augments si necesita la validacion requerida se debe pasar como true, porque si accede con la funcion las validaciones no se ejecutan en el orden correcto
     * @example La opción seleccionada no es válida.Este campo es requerido.
     */
    static selectInList(this: void, options: any[]) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value: string = control.value || '';
            if (!value) {
                return { required: { message: 'Este campo es requerido' } };
            }

            const valid = options.find(option => option.value === value);
            return !valid ? { selectInList: { message: 'La opción seleccionada no es válida.' } } : null;
        };
    }
    /**
     * Validación de checkbox marcado (true).
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el checkbox no está marcado o null si es válido.
     */
    static checked(this: void, control: AbstractControl): ValidationErrors | null {
        if (control.value !== true) {
            return { checked: { message: 'Debes marcar esta casilla.' } };
        }
        return null;
    }

    /**
     * Validación de checkbox desmarcado (false).
     * @param control - Control del formulario que se está validando.
     * @returns ValidationErrors | null - Error si el checkbox está marcado o null si es válido.
     */
    static unchecked(this: void, control: AbstractControl): ValidationErrors | null {
        if (control.value === true) {
            return { unchecked: { message: 'Esta casilla debe estar desmarcada.' } };
        }
        return null;
    }
}
