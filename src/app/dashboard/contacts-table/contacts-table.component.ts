import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActionButton, AddButton, DataTableColumn, DataTableComponent, DeleteModalConfig } from '@/app/components/tankstack-table/tankstack-table.component';

interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  location: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

@Component({
  selector: 'app-contacts-table',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './contacts-table.component.html',
})
export class ContactsTableComponent {

  // --- Datos de ejemplo ---
  data: Contact[] = [
    { id: 1,  name: 'Emma Adams',     role: 'Web Developer',  email: 'adams@mail.com',     location: 'Boston, USA',     phone: '+1 (070) 123-4567', status: 'Active' },
    { id: 2,  name: 'Olivia Allen',    role: 'Web Designer',   email: 'allen@mail.com',     location: 'Sydney, Australia',phone: '+61 (125) 450-1500', status: 'Active' },
    { id: 3,  name: 'Isabella Anderson', role: 'UX/UI Designer', email: 'anderson@mail.com',  location: 'Miami, USA',      phone: '+1 (100) 154-1254', status: 'Pending' },
    { id: 4,  name: 'Amelia Armstrong', role: 'Ethical Hacker', email: 'armstrong@mail.com', location: 'Tokyo, Japan',    phone: '+81 (154) 199-1540', status: 'Inactive' },
    { id: 5,  name: 'Emily Atkinson',   role: 'Web Developer',  email: 'atkinson@mail.com',  location: 'Edinburgh, UK',   phone: '+44 (900) 150-1500', status: 'Active' },
    { id: 6,  name: 'Sofia Bailey',     role: 'UX/UI Designer', email: 'bailey@mail.com',    location: 'New York, USA',   phone: '+1 (001) 160-1845', status: 'Pending' },
    { id: 7,  name: 'Victor Sharma',    role: 'Project Manager',email: 'sharma@mail.com',    location: 'Miami, USA',      phone: '+1 (110) 180-1600', status: 'Active' },
    { id: 8,  name: 'Penelope Baker',   role: 'Web Developer',  email: 'baker@mail.com',     location: 'Edinburgh, UK',   phone: '+44 (405) 483-4512', status: 'Inactive' },
  ];

  // --- Columnas (con filtros, orden y acciones) ---
  columns: DataTableColumn<Contact>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorFn: (r) => r.name,
      enableFiltering: true,
      enableSorting: true,
      deleteModal: { useAsReference: true, label: 'Nombre' },
    },
    {
      id: 'email',
      header: 'Email',
      accessorFn: (r) => r.email,
      enableFiltering: true,
      enableSorting: true,
    },
    {
      id: 'location',
      header: 'Location',
      accessorFn: (r) => r.location,
      enableFiltering: true,
      enableSorting: true,
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorFn: (r) => r.phone,
      enableFiltering: true,
      enableSorting: false,
    },
    {
      id: 'status',
      header: 'Status',
      accessorFn: (r) => r.status,
      enableFiltering: true,
      enableSorting: true,
      // El componente mostrará badges automáticos según el valor
    },
    {
      id: 'actions',
      header: 'Acciones',
      exportable: false,
      enableFiltering: false,
      enableSorting: false,
      actions: [
        {
          icon: 'ti ti-eye',
          label: 'Ver',
          type: 'router',
          routerLink: (row) => `/contacts/${row.id}`,
          tooltip: (row) => `Ver ${row.name}`,
        },
        {
          icon: 'ti ti-pencil',
          label: 'Editar',
          type: 'router',
          routerLink: (row) => `/contacts/${row.id}/edit`,
          tooltip: (row) => `Editar ${row.name}`,
        },
        {
          icon: 'ti ti-trash',
          label: 'Eliminar',
          cssClass: 'danger',            // será detectado como "eliminar" por el componente
          type: 'action',
          action: (row) => this.deleteRow(row),
          tooltip: (row) => `Eliminar ${row.name}`,
        },
      ] as ActionButton<Contact>[],
    },
  ];

  // --- Botón Agregar ---
  addButton: AddButton = {
    type: 'router',
    label: 'Agregar',
    icon: 'ti ti-plus',
    tooltip: 'Agregar contacto',
    routerLink: '/contacts/new',
    visible: true,
  };

  // --- Botón Key (opcional) ---
  keyButton: AddButton = {
    type: 'action',
    icon: 'ti ti-key',
    tooltip: 'Gestionar permisos',
    visible: true,
    action: () => alert('Abrir gestor de llaves/permisos'),
  };

  // --- Dropdowns personalizados del header (opcional) ---
  headerButtons = [
    {
      id: 'bulk',
      type: 'dropdown',
      icon: 'ti ti-dots',
      tooltip: 'Acciones masivas',
      dropdownHeader: 'Acciones',
      dropdownOpen: false,
      dropdownItems: [
        { label: 'Activar seleccionados', icon: 'ti ti-check', action: () => alert('Activar') },
        { label: 'Desactivar seleccionados', icon: 'ti ti-x', action: () => alert('Desactivar') },
      ],
      visible: true,
    },
  ];

  // --- Configuración del modal de eliminación (opcional) ---
  deleteModalConfig: DeleteModalConfig = {
    idField: 'id',
    referenceField: 'name',
    idLabel: 'ID',
    referenceLabel: 'Contacto',
  };

  // --- Handlers de demo ---
  onExport(ev: { data: Contact[]; format: string }) {
    console.log('Exportando', ev.format, ev.data);
  }

  private deleteRow(row: Contact) {
    // Aquí harías la llamada a tu servicio para eliminar
    console.log('Eliminar contacto:', row);
    // Simular borrado local:
    this.data = this.data.filter((r) => r.id !== row.id);
  }
}
