import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICustomer, ICustomerResponse, SaveFormRequest } from './customer.models';
import { environment } from '@/env/environment.development';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/customers`;

    // Obtener todos los clientes
    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(this.apiUrl).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Obtener cliente por ID
    getCustomer(customerId: string): Observable<ICustomer> {
        return this.http.get<ICustomer>(`${this.apiUrl}/${customerId}`).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Crear nuevo cliente
    createCustomer(customer: Partial<ICustomer>): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.apiUrl, customer).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Actualizar cliente existente
    updateCustomer(customerId: string, updates: Partial<ICustomer>): Observable<ICustomer> {
        return this.http.put<ICustomer>(`${this.apiUrl}/${customerId}`, updates).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Eliminar cliente
    deleteCustomer(customerId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${customerId}`).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Guardar cliente completo
    saveCustomer(customer: ICustomer): Observable<ICustomer> {
        if (customer.id) {
            return this.updateCustomer(customer.id, customer);
        } else {
            return this.createCustomer(customer);
        }
    }

    // Guardar sección específica
    saveSection(request: SaveFormRequest): Observable<ICustomerResponse> {
        const url = request.customerId
            ? `${this.apiUrl}/${request.customerId}/sections/${request.section}`
            : `${this.apiUrl}/sections/${request.section}`;

        return this.http.patch<ICustomerResponse>(url, {
            section: request.section,
            data: request.data
        }).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    // Obtener cliente por sección
    getCustomerSection(customerId: string, section: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${customerId}/sections/${section}`).pipe(
            catchError(error => throwError(() => this.extractErrorMessage(error)))
        );
    }

    /**
     * Extrae el mensaje de error de manera consistente
     * Siguiendo el mismo patrón que AuthenticationService
     */
    private extractErrorMessage(error: any): string {
        if (Array.isArray(error.error?.message)) {
            return error.error.message.join(', ');
        }
        return error.error?.message || error.message || 'Error desconocido en el servicio de clientes';
    }
}
