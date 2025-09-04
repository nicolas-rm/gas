import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICustomer, ICustomerResponse, SaveFormRequest } from '@/dashboard/customer/ngrx/customer.models';
import { environment } from '@/env/environment.development';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly apiUrl = `${environment.apiUrl}/customers`;

    constructor(private http: HttpClient) { }

    // Get all customers
    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<ICustomer[]>(this.apiUrl);
    }

    // Get single customer
    getCustomer(customerId: string): Observable<ICustomer> {
        return this.http.get<ICustomer>(`${this.apiUrl}/${customerId}`);
    }

    // Create new customer
    createCustomer(customer: Partial<ICustomer>): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.apiUrl, customer);
    }

    // Update existing customer
    updateCustomer(customerId: string, updates: Partial<ICustomer>): Observable<ICustomer> {
        return this.http.put<ICustomer>(`${this.apiUrl}/${customerId}`, updates);
    }

    // Delete customer
    deleteCustomer(customerId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
    }

    // Save complete customer
    saveCustomer(customer: ICustomer): Observable<ICustomer> {
        if (customer.id) {
            return this.updateCustomer(customer.id, customer);
        } else {
            return this.createCustomer(customer);
        }
    }

    // Save specific section
    saveSection(request: SaveFormRequest): Observable<ICustomerResponse> {
        const url = request.customerId
            ? `${this.apiUrl}/${request.customerId}/sections/${request.section}`
            : `${this.apiUrl}/sections/${request.section}`;

        return this.http.patch<ICustomerResponse>(url, {
            section: request.section,
            data: request.data
        });
    }

    // Get customer by section
    getCustomerSection(customerId: string, section: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${customerId}/sections/${section}`);
    }
}
