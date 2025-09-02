/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, HostListener, Output, EventEmitter, OnChanges, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, createTable, PaginationState, SortingState, ColumnFiltersState, VisibilityState, ColumnDef, Table, Row, Column } from '@tanstack/angular-table';
import { HeaderButton, HeaderDropdownItem } from './header-button.interface';

export interface AddButton {
    icon?: string;
    label?: string;
    cssClass?: string;
    tooltip?: string;
    // Para acciones de función
    action?: () => void;
    // Para navegación con router
    routerLink?: string;
    routerQueryParams?: any;
    routerFragment?: string;
    // Para abrir en nueva ventana
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    // Configuración de visibilidad
    visible?: boolean;
    // Configuración de disabled
    disabled?: boolean;
    // Tipo de acción para identificar el comportamiento
    type: 'action' | 'router' | 'link';
}

export interface ActionButton<T> {
    icon?: string;
    label?: string;
    cssClass?: string;
    // Para acciones de función
    action?: (row: T) => void;
    // Para navegación con router
    routerLink?: string | ((row: T) => string);
    routerQueryParams?: any | ((row: T) => any);
    routerFragment?: string | ((row: T) => string);
    // Para abrir en nueva ventana
    href?: string | ((row: T) => string);
    target?: '_blank' | '_self' | '_parent' | '_top';
    // Configuración de visibilidad
    visible?: (row: T) => boolean;
    // Configuración de disabled
    disabled?: (row: T) => boolean;
    // Tooltip personalizado
    tooltip?: string | ((row: T) => string);
    // Tipo de acción para identificar el comportamiento
    type?: 'action' | 'router' | 'link';
}

export interface DeleteModalConfig {
    idField?: string; // Campo específico para ID (ej: 'id', 'codigo')
    referenceField?: string; // Campo específico para referencia (ej: 'nombre', 'descripcion')
    idLabel?: string; // Label para mostrar antes del ID
    referenceLabel?: string; // Label para mostrar antes de la referencia
    customGetter?: {
        // Funciones personalizadas para obtener los valores
        id?: (item: any) => string;
        reference?: (item: any) => string;
    };
}

export interface DataTableColumn<T> {
    id: string;
    header: string;
    accessorFn?: (row: T) => any;
    cell?: (info: any) => string | number | null | undefined;
    actions?: ActionButton<T>[];
    enableSorting?: boolean;
    enableFiltering?: boolean;
    hidden?: boolean;
    exportable?: boolean;
    meta?: Record<string, any>;
    // Configuración para el modal de eliminación
    deleteModal?: {
        useAsId?: boolean; // Usar esta columna como ID en el modal
        useAsReference?: boolean; // Usar esta columna como referencia en el modal
        label?: string; // Label personalizado para mostrar en el modal
    };
}

export type SortDirection = 'asc' | 'desc' | false;

/**
 * Componente de tabla de datos avanzada con características como ordenación, filtrado y paginación
 * Con diseño moderno y responsive
 * Utilizando TanStack Table para manejo de estados
 */
@Component({ selector: 'app-data-table', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './tankstack-table.component.html', styleUrls: ['./tankstack-table.component.css'] })
export class DataTableComponent<T> implements OnInit, OnChanges, AfterViewInit {
    @Input() data: T[] = [];
    @Input() columns: DataTableColumn<T>[] = [];
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() enablePagination: boolean = true;
    @Input() pageSize: number = 10;
    @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    @Input() enableGlobalFilter: boolean = false;
    @Input() enableColumnFilters: boolean = false;
    @Input() filterPlaceholder: string = 'Buscar...';
    @Input() dateLocale: string = 'es-ES';
    @Input() exportFileName: string = 'datos-exportados';
    @Input() headerButtons: HeaderButton[] = []; // Botones personalizados del header
    @Input() addButton?: AddButton; // Configuración del botón de agregar
    @Input() keyButton?: AddButton; // Configuración del botón de key para modales
    @Input() deleteModalConfig?: DeleteModalConfig; // Configuración personalizada para el modal de eliminación
    @ViewChild('searchInput') searchInput!: ElementRef;
    @ViewChild('rowTooltip') rowTooltip!: ElementRef;

    @Output() onExport = new EventEmitter<{ data: T[]; format: string }>();

    // Inyección del router para navegación
    private router = inject(Router);

    // Estados de la tabla con TanStack
    sorting = signal<SortingState>([]);
    columnFilters = signal<ColumnFiltersState>([]);
    globalFilter = signal<string>('');
    pagination = signal<PaginationState>({
        pageIndex: 0,
        pageSize: this.pageSize
    });
    columnVisibility = signal<VisibilityState>({});

    // UI estado
    showColumnsMenu: boolean = false;
    showExportMenu: boolean = false;
    showDeleteModal: boolean = false;
    deleteItemToConfirm: T | null = null;

    // Propiedades computadas (TanStack)
    tableColumns = computed(() => this.getTableColumns());
    table = computed<Table<T>>(() => {
        if (!this.columns || !Array.isArray(this.columns) || this.columns.length === 0) {
            return this.createEmptyTable();
        }
        try {
            return createTable<T>({
                data: this.data,
                columns: this.tableColumns(),
                state: {
                    sorting: this.sorting(),
                    globalFilter: this.globalFilter(),
                    columnFilters: this.columnFilters(),
                    pagination: this.pagination(),
                    columnVisibility: this.columnVisibility()
                },
                onSortingChange: updater => {
                    this.sorting.set(typeof updater === 'function' ? updater(this.sorting()) : updater);
                },
                onGlobalFilterChange: updater => {
                    this.globalFilter.set(typeof updater === 'function' ? updater(this.globalFilter()) : updater);
                },
                onColumnFiltersChange: updater => {
                    this.columnFilters.set(typeof updater === 'function' ? updater(this.columnFilters()) : updater);
                },
                onPaginationChange: updater => {
                    this.pagination.set(typeof updater === 'function' ? updater(this.pagination()) : updater);
                },
                onColumnVisibilityChange: updater => {
                    this.columnVisibility.set(typeof updater === 'function' ? updater(this.columnVisibility()) : updater);
                },
                onStateChange: () => { },
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: getSortedRowModel(),
                getFilteredRowModel: getFilteredRowModel(),
                getPaginationRowModel: getPaginationRowModel(),
                globalFilterFn: (row, columnId, value) => {
                    const cellValue = row.getValue(columnId);
                    if (cellValue === null || cellValue === undefined) return false;
                    return String(cellValue as string)
                        .toLowerCase()
                        .includes(String(value).toLowerCase());
                },
                renderFallbackValue: ''
            });
        } catch (error) {
            console.error('Error al crear la tabla:', error);
            return this.createEmptyTable();
        }
    });

    // Propiedades computadas para detección de contenido mínimo y posicionamiento de dropdowns
    hasVisibleColumns = computed(() => {
        try {
            const visibleColumns = this.getVisibleColumnDefinitions();
            return visibleColumns && visibleColumns.length > 0;
        } catch (error) {
            console.error('Error al verificar columnas visibles:', error);
            return false;
        }
    });

    isMinimalContent = computed(() => {
        try {
            const hasVisibleCols = this.hasVisibleColumns();
            const hasData = this.data && this.data.length > 0;
            return !hasVisibleCols || !hasData;
        } catch (error) {
            console.error('Error al verificar contenido mínimo:', error);
            return true;
        }
    });
    dropdownPositionClass = computed(() => {
        try {
            const hasVisibleCols = this.hasVisibleColumns();
            const hasData = this.data && this.data.length > 0;
            const isMinimal = !hasVisibleCols || !hasData;

            // Aplicar posicionamiento fijo cuando:
            // 1. No hay columnas visibles
            // 2. No hay datos
            // 3. Hay muy pocas filas visibles (menos de 3)
            const visibleRowCount = hasData ? Math.min(this.data.length, this.pageSize) : 0;
            const shouldUseFixedPosition = isMinimal || visibleRowCount < 3;

            return shouldUseFixedPosition ? 'dropdown-fixed-position' : 'dropdown-normal-position';
        } catch (error) {
            console.error('Error al calcular clase de posicionamiento de dropdown:', error);
            return 'dropdown-fixed-position'; // Fallback a posición fija para mayor seguridad
        }
    });

    // Escuchar clics en todo el documento para cerrar menús desplegables    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        // Cerrar modal de eliminación si se hace clic fuera
        if (this.showDeleteModal) {
            const isInsideModal = target.closest('.delete-modal');
            if (!isInsideModal) {
                this.closeDeleteModal();
            }
        }

        if (this.showColumnsMenu || this.showExportMenu || this.headerButtons.some(btn => btn.dropdownOpen)) {
            const isToggleButton = target.closest('.action-button');
            const isInsideMenu = target.closest('.dropdown-menu');

            if (!isToggleButton && !isInsideMenu) {
                this.closeAllDropdowns();
            }
        }
    }
    // Escuchar scroll para cerrar menús desplegables
    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this.showColumnsMenu || this.showExportMenu || this.headerButtons.some(btn => btn.dropdownOpen)) {
            this.closeAllDropdowns();
        }
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        // Cerrar dropdowns si se hace clic fuera de ellos
        if (this.showColumnsMenu || this.showExportMenu || this.headerButtons.some(btn => btn.dropdownOpen)) {
            const isToggleButton = target.closest('.action-button');
            const isInsideMenu = target.closest('.dropdown-menu');

            if (!isToggleButton && !isInsideMenu) {
                this.closeAllDropdowns();
            }
        }
    }

    // Escuchar tecla Escape para cerrar modal
    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: KeyboardEvent | Event): void {
        // Si necesitas usar propiedades del teclado:
        // const e = event as KeyboardEvent;

        if (this.showDeleteModal) {
            this.closeDeleteModal();
        }
        this.closeAllDropdowns();
    }


    // Escuchar cambios de tamaño de ventana para reposicionar dropdowns
    @HostListener('window:resize', [])
    onWindowResize() {
        if (this.showColumnsMenu || this.showExportMenu || this.headerButtons.some(btn => btn.dropdownOpen)) {
            // Reposicionar dropdowns después de cambio de tamaño
            setTimeout(() => {
                this.adjustDropdownPosition();
            }, 100);
        }
    }

    ngOnInit(): void {
        // Inicializar visibilidad de columnas
        const visibilityState: VisibilityState = {};
        this.columns.forEach(column => {
            visibilityState[column.id] = !column.hidden;
        });
        this.columnVisibility.set(visibilityState);

        // Inicializar tamaño de página
        this.pagination.set({
            pageIndex: 0,
            pageSize: this.pageSize
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['pageSize'] && !changes['pageSize'].firstChange) {
            this.pagination.update(state => ({
                ...state,
                pageSize: this.pageSize
            }));
        }

        if (changes['columns'] && !changes['columns'].firstChange) {
            // Actualizar visibilidad de columnas
            const visibilityState: VisibilityState = {};
            this.columns.forEach(column => {
                visibilityState[column.id] = !column.hidden;
            });
            this.columnVisibility.set(visibilityState);
        }
    }
    ngAfterViewInit(): void {
        // Establecer el foco en el campo de búsqueda si está habilitado
        if (this.enableGlobalFilter && this.searchInput) {
            setTimeout(() => {
                this.searchInput.nativeElement.focus();
            }, 0);
        } // Configurar event listeners para el scroll horizontal
        setTimeout(() => {
            this.setupScrollListeners();
            // this.setupTooltips(); // Comentado para evitar interferencia con tooltip personalizado
        }, 100);
    }

    /**
     * Configura los event listeners para el scroll horizontal
     */
    private setupScrollListeners(): void {
        const tableResponsive = document.querySelector('.table-responsive');
        if (tableResponsive) {
            tableResponsive.addEventListener('scroll', this.onTableScroll.bind(this));

            // Verificar estado inicial
            this.onTableScroll({ target: tableResponsive } as any);
        }
    } // Crea una tabla vacía segura para evitar errores de TanStack
    private createEmptyTable(): Table<T> {
        const emptyColumns: ColumnDef<T, any>[] = [
            {
                id: 'empty',
                header: 'Sin datos',
                accessorFn: () => 'No hay datos disponibles',
                cell: () => 'No hay datos disponibles'
            }
        ];

        return createTable<T>({
            data: [],
            columns: emptyColumns,
            state: {
                sorting: [],
                columnFilters: [],
                globalFilter: '',
                pagination: { pageIndex: 0, pageSize: 10 },
                columnVisibility: {}
            },
            onSortingChange: () => { },
            onGlobalFilterChange: () => { },
            onColumnFiltersChange: () => { },
            onPaginationChange: () => { },
            onColumnVisibilityChange: () => { },
            onStateChange: () => { },
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            renderFallbackValue: '',
            globalFilterFn: () => false
        });
    }

    // Convertir columnas del formato personalizado a formato TanStack
    private getTableColumns(): ColumnDef<T, any>[] {
        return this.columns.map(column => ({
            id: column.id,
            header: column.header,
            accessorFn: column.accessorFn || ((row: T) => (row as any)[column.id]),
            cell: info => {
                const value = info.getValue();

                if (column.cell) {
                    const customValue = column.cell({
                        getValue: () => value,
                        row: info.row.original,
                        column
                    });
                    return this.formatValue(customValue);
                }

                return this.formatValue(value);
            },
            enableSorting: column.enableSorting !== false,
            enableColumnFilter: column.enableFiltering === true,
            meta: {
                originalColumn: column,
                exportable: column.exportable !== false
            }
        }));
    }

    // Método para manejar el cambio en el filtro global
    onGlobalFilterChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.globalFilter.set(target.value);

        // Resetear paginación al filtrar
        this.pagination.update(state => ({
            ...state,
            pageIndex: 0
        }));
    }

    // Método para manejar el cambio en filtros de columna
    onColumnFilterChange(columnId: string, event: Event): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        const currentFilters = this.columnFilters();
        const filteredFilters = currentFilters.filter(f => f.id !== columnId);

        if (value) {
            filteredFilters.push({ id: columnId, value });
        }

        this.columnFilters.set(filteredFilters);

        // Resetear paginación al filtrar
        this.pagination.update(state => ({
            ...state,
            pageIndex: 0
        }));
    }

    // Obtener valor de filtro de columna
    getColumnFilterValue(columnId: string): string {
        const filter = this.columnFilters().find(f => f.id === columnId);
        return filter ? String(filter.value) : '';
    }

    // Método principal para alternar dropdowns con posicionamiento mejorado
    toggleDropdown(type: 'export' | 'columns', event: Event): void {
        event.stopPropagation();

        if (type === 'export') {
            this.showExportMenu = !this.showExportMenu;
            this.showColumnsMenu = false;
        } else {
            this.showColumnsMenu = !this.showColumnsMenu;
            this.showExportMenu = false;
        }

        // Solo ajustar posición cuando se abre un dropdown
        if (this.showExportMenu || this.showColumnsMenu) {
            setTimeout(() => {
                this.adjustDropdownPosition();
            }, 0);
        }
    } // Método mejorado para ajustar posición de dropdowns
    private adjustDropdownPosition(): void {
        requestAnimationFrame(() => {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');

            dropdowns.forEach(dropdown => {
                const dropdownElement = dropdown as HTMLElement;
                const hasVisibleCols = this.hasVisibleColumns();
                const hasData = this.data && this.data.length > 0;
                const visibleRowCount = hasData ? Math.min(this.data.length, this.pageSize) : 0;
                const shouldUseFixedPosition = !hasVisibleCols || !hasData || visibleRowCount < 3;

                if (shouldUseFixedPosition) {
                    // Para contenido mínimo o tabla pequeña, usar posición fija
                    dropdownElement.classList.add('dropdown-fixed-position');
                    dropdownElement.classList.remove('dropdown-normal-position');

                    // Asegurar máxima visibilidad
                    dropdownElement.style.zIndex = '10001';
                    dropdownElement.style.visibility = 'visible';
                    dropdownElement.style.opacity = '1';
                    dropdownElement.style.pointerEvents = 'auto';

                    // Verificar posicionamiento en móviles
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        dropdownElement.style.position = 'fixed';
                        dropdownElement.style.top = '10%';
                        dropdownElement.style.left = '5%';
                        dropdownElement.style.right = '5%';
                        dropdownElement.style.width = 'auto';
                        dropdownElement.style.maxWidth = '90vw';
                    }
                } else {
                    // Para contenido normal, usar posición absoluta
                    dropdownElement.classList.remove('dropdown-fixed-position');
                    dropdownElement.classList.add('dropdown-normal-position');

                    // Resetear estilos específicos de posición fija
                    dropdownElement.style.position = '';
                    dropdownElement.style.top = '';
                    dropdownElement.style.bottom = '';
                    dropdownElement.style.marginBottom = '';
                    dropdownElement.style.right = '';
                    dropdownElement.style.left = '';
                    dropdownElement.style.width = '';
                    dropdownElement.style.maxWidth = '';

                    // Verificar si se sale del viewport y ajustar
                    setTimeout(() => {
                        const rect = dropdownElement.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const viewportWidth = window.innerWidth;

                        // Ajustar si se sale por abajo
                        if (rect.bottom > viewportHeight - 20) {
                            dropdownElement.style.top = 'auto';
                            dropdownElement.style.bottom = '100%';
                            dropdownElement.style.marginBottom = '0.5rem';
                        }

                        // Ajustar si se sale por la derecha
                        if (rect.right > viewportWidth - 20) {
                            dropdownElement.style.right = '0';
                            dropdownElement.style.left = 'auto';
                        }
                    }, 50);
                }
            });
        });
    } // Método para cerrar todos los dropdowns
    closeAllDropdowns(): void {
        this.showColumnsMenu = false;
        this.showExportMenu = false;

        // Cerrar dropdowns personalizados
        this.headerButtons.forEach(button => {
            button.dropdownOpen = false;
        });
    }

    // Método para verificar si una columna es visible
    isColumnVisible(columnId: string): boolean {
        const visibility = this.columnVisibility();
        return visibility[columnId] !== false;
    }

    // Método para alternar visibilidad de columna
    toggleColumnVisibility(column: DataTableColumn<T>, event: Event): void {
        event.stopPropagation();

        const currentVisibility = this.columnVisibility();
        const newVisibility = {
            ...currentVisibility,
            [column.id]: !this.isColumnVisible(column.id)
        };

        this.columnVisibility.set(newVisibility);
    }

    // Métodos de exportación
    exportData(format: 'csv' | 'excel', event: Event): void {
        event.stopPropagation();

        try {
            const exportableColumns = this.getVisibleColumnDefinitions().filter(col => col.exportable !== false);
            const exportData = this.getPaginatedData().map(item => {
                const row: any = {};
                exportableColumns.forEach(column => {
                    row[column.header] = this.getColumnValue(item, column);
                });
                return row;
            });

            if (format === 'csv') {
                this.exportToCSV(exportData, exportableColumns);
            } else if (format === 'excel') {
                this.exportToExcel(exportData, exportableColumns);
            }

            // Emitir evento de exportación
            this.onExport.emit({ data: exportData, format });

            // Cerrar dropdown después de exportar
            this.closeAllDropdowns();
        } catch (error) {
            console.error('Error al exportar datos:', error);
        }
    }

    private exportToCSV(data: any[], columns: DataTableColumn<T>[]): void {
        const headers = columns.map(col => col.header).join(',');
        const rows = data.map(row =>
            columns
                .map(col => {
                    const value = row[col.header];
                    // Escapar comillas y envolver en comillas si contiene comas
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(',')
        );

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${this.exportFileName}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    private exportToExcel(data: any[], columns: DataTableColumn<T>[]): void {
        // Implementación básica para Excel (requiere librería externa para funcionalidad completa)
        console.log('Exportar a Excel requiere implementación específica con librería como SheetJS');
        // Por ahora, exportar como CSV con extensión .xlsx
        this.exportToCSV(data, columns);
    }

    // Métodos de ordenación
    handleSort(columnId: string): void {
        const currentSorting = this.sorting();
        const existingSort = currentSorting.find(s => s.id === columnId);

        let newSorting: SortingState;

        if (!existingSort) {
            // Nueva ordenación ascendente
            newSorting = [{ id: columnId, desc: false }];
        } else if (!existingSort.desc) {
            // Cambiar a descendente
            newSorting = [{ id: columnId, desc: true }];
        } else {
            // Remover ordenación
            newSorting = [];
        }

        this.sorting.set(newSorting);
    }

    // Métodos de paginación
    get totalItems(): number {
        try {
            return this.table().getFilteredRowModel().rows.length;
        } catch (error) {
            return this.data?.length || 0;
        }
    }

    get paginationStart(): number {
        const pageIndex = this.pagination().pageIndex;
        const pageSize = this.pagination().pageSize;
        return pageIndex * pageSize + 1;
    }

    get paginationEnd(): number {
        const pageIndex = this.pagination().pageIndex;
        const pageSize = this.pagination().pageSize;
        const total = this.totalItems;
        return Math.min((pageIndex + 1) * pageSize, total);
    }

    get isFirstPage(): boolean {
        return this.pagination().pageIndex === 0;
    }

    get isLastPage(): boolean {
        const pageIndex = this.pagination().pageIndex;
        const pageSize = this.pagination().pageSize;
        const total = this.totalItems;
        return (pageIndex + 1) * pageSize >= total;
    }

    goToFirstPage(): void {
        this.pagination.update(state => ({ ...state, pageIndex: 0 }));
    }

    goToPreviousPage(): void {
        const currentIndex = this.pagination().pageIndex;
        if (currentIndex > 0) {
            this.pagination.update(state => ({ ...state, pageIndex: currentIndex - 1 }));
        }
    }

    goToNextPage(): void {
        const currentIndex = this.pagination().pageIndex;
        const pageSize = this.pagination().pageSize;
        const total = this.totalItems;
        const maxPage = Math.ceil(total / pageSize) - 1;

        if (currentIndex < maxPage) {
            this.pagination.update(state => ({ ...state, pageIndex: currentIndex + 1 }));
        }
    }

    goToLastPage(): void {
        const pageSize = this.pagination().pageSize;
        const total = this.totalItems;
        const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
        this.pagination.update(state => ({ ...state, pageIndex: lastPage }));
    }

    handlePageChange(pageIndex: number): void {
        this.pagination.update(state => ({ ...state, pageIndex }));
    }

    changePageSize(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const newPageSize = parseInt(target.value, 10);

        this.pagination.update(() => ({
            pageIndex: 0, // Resetear a primera página
            pageSize: newPageSize
        }));
    }

    getVisiblePages(): number[] {
        const pageIndex = this.pagination().pageIndex;
        const pageSize = this.pagination().pageSize;
        const total = this.totalItems;
        const totalPages = Math.ceil(total / pageSize);

        const delta = 2; // Número de páginas a mostrar a cada lado
        const start = Math.max(0, pageIndex - delta);
        const end = Math.min(totalPages - 1, pageIndex + delta);

        const pages: number[] = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    // Método para formatear valores de manera segura
    private formatValue(value: any): string {
        if (value === null || value === undefined) return '';

        if (value instanceof Date) {
            return value.toLocaleDateString(this.dateLocale);
        }

        if (typeof value === 'number') {
            return value.toString();
        }

        return String(value);
    }

    // Método para obtener el valor de una celda para mostrar en la UI
    getDisplayValue(row: Row<T>, column: Column<T, unknown>): string {
        return this.formatValue(row.getValue(column.id));
    }

    // Método para obtener el valor de una celda (valor raw)
    getValue(row: Row<T>, column: Column<T, unknown>): any {
        return row.getValue(column.id);
    }
    // Método para seleccionar la clase de badge según el valor
    getBadgeClass(value: any): string {
        if (value === null || value === undefined) return 'secondary';

        const strValue = String(value).toLowerCase();

        if (['activo', 'active', 'enabled', 'success', 'completado', 'completed', 'aprobado', 'approved', 'yes', 'sí', 'true'].includes(strValue)) {
            return 'success';
        }

        if (['inactivo', 'inactive', 'disabled', 'error', 'failed', 'fallido', 'rechazado', 'rejected', 'no', 'false'].includes(strValue)) {
            return 'danger';
        }

        if (['pendiente', 'pending', 'en progreso', 'in progress', 'warning', 'alerta', 'alert'].includes(strValue)) {
            return 'warning';
        }

        if (['información', 'info', 'información', 'note', 'nota'].includes(strValue)) {
            return 'info';
        }

        return 'secondary';
    }

    // Determina si un valor debería mostrarse como un badge
    shouldShowAsBadge(value: any): boolean {
        if (value === null || value === undefined) return false;

        const strValue = String(value).toLowerCase();
        const statusValues = ['activo', 'active', 'inactivo', 'inactive', 'pendiente', 'pending', 'completado', 'completed', 'aprobado', 'approved', 'rechazado', 'rejected', 'en progreso', 'in progress', 'success', 'error', 'warning', 'info', 'enabled', 'disabled', 'fallido', 'failed'];

        return statusValues.includes(strValue) || typeof value === 'boolean' || ['yes', 'no', 'sí'].includes(strValue);
    }

    // Obtener el encabezado de una columna por su ID
    getColumnHeader(columnId: string): string {
        const column = this.columns.find(c => c.id === columnId);
        return column?.header || columnId;
    }

    // Obtener la dirección de ordenación actual para una columna
    getSortDirection(columnId: string): SortDirection {
        const sortItem = this.sorting().find(s => s.id === columnId);
        if (!sortItem) return false;
        return sortItem.desc ? 'desc' : 'asc';
    }
    // Obtener el número máximo de columnas para colspan
    getMaxColumns(): number {
        const visibleCols = this.getVisibleColumnDefinitions().length;
        return Math.max(visibleCols, 1);
    }
    // MÉTODO COMENTADO - Ya no se usa en el template, usamos enfoque directo
    /*
    // Obtener las celdas de una fila de manera segura
    getRowCells(row: Row<T>): any[] {
        try {
            if (!row || typeof row.getVisibleCells !== 'function') {
                return [];
            }
            const cells = row.getVisibleCells();
            return cells || [];
        } catch (error) {
            console.error('Error al obtener celdas de la fila:', error);
            return [];
        }
    }
    */

    // Métodos para implementación directa sin TanStack Table en template
    getPaginatedData(): T[] {
        try {
            if (!this.data || !Array.isArray(this.data)) return [];

            // Aplicar filtro global si está habilitado
            let filteredData = this.data;
            if (this.globalFilter() && this.globalFilter().trim()) {
                const filterValue = this.globalFilter().toLowerCase();
                filteredData = this.data.filter(item => {
                    return this.columns.some(column => {
                        const value = this.getColumnValue(item, column);
                        return String(value).toLowerCase().includes(filterValue);
                    });
                });
            }

            // Aplicar filtros por columna
            const columnFilters = this.columnFilters();
            if (columnFilters.length > 0) {
                filteredData = filteredData.filter(item => {
                    return columnFilters.every(filter => {
                        const column = this.columns.find(col => col.id === filter.id);
                        if (!column) return true;

                        const value = this.getColumnValue(item, column);
                        if (value === null || value === undefined) return false;

                        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                    });
                });
            }

            // Aplicar ordenación
            const sortedData = this.applySorting(filteredData);

            // Aplicar paginación
            if (this.enablePagination) {
                const { pageIndex, pageSize } = this.pagination();
                const start = pageIndex * pageSize;
                const end = start + pageSize;
                return sortedData.slice(start, end);
            }

            return sortedData;
        } catch (error) {
            console.error('Error al obtener datos paginados:', error);
            return [];
        }
    }

    getVisibleColumnDefinitions(): DataTableColumn<T>[] {
        try {
            // Combina el estado hidden y el estado columnVisibility para determinar las columnas visibles
            return this.columns.filter(col => {
                // Una columna es visible si no está marcada como hidden Y su visibilidad no es false
                return !col.hidden && this.columnVisibility()[col.id] !== false;
            });
        } catch (error) {
            console.error('Error al obtener columnas visibles:', error);
            return [];
        }
    }

    getColumnValue(item: T, column: DataTableColumn<T>): any {
        try {
            if (column.accessorFn) {
                return column.accessorFn(item);
            }
            return (item as any)[column.id];
        } catch (error) {
            console.error('Error al obtener valor de columna:', error);
            return null;
        }
    }

    formatColumnValue(item: T, column: DataTableColumn<T>): string {
        try {
            const value = this.getColumnValue(item, column);

            if (column.cell) {
                const cellValue = column.cell({
                    getValue: () => value,
                    row: item,
                    column
                });
                return this.formatValue(cellValue);
            }

            return this.formatValue(value);
        } catch (error) {
            console.error('Error al formatear valor de columna:', error);
            return '';
        }
    }
    private applySorting(data: T[]): T[] {
        try {
            const sorting = this.sorting();
            if (!sorting || sorting.length === 0) return data;

            return [...data].sort((a, b) => {
                for (const sort of sorting) {
                    const column = this.columns.find(col => col.id === sort.id);
                    if (!column) continue;

                    const aValue = this.getColumnValue(a, column);
                    const bValue = this.getColumnValue(b, column);

                    let comparison = 0;
                    if (aValue < bValue) comparison = -1;
                    if (aValue > bValue) comparison = 1;

                    if (comparison !== 0) {
                        return sort.desc ? -comparison : comparison;
                    }
                }
                return 0;
            });
        } catch (error) {
            console.error('Error al aplicar ordenación:', error);
            return data;
        }
    }

    /**
     * Maneja el evento de scroll horizontal para indicadores visuales
     */
    onTableScroll(event: Event) {
        const element = event.target as HTMLElement;
        const isScrollable = element.scrollWidth > element.clientWidth;
        const isAtEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 5;

        if (isScrollable && !isAtEnd) {
            element.classList.add('scrollable');
        } else {
            element.classList.remove('scrollable');
        }
    } /**
     * Configura tooltips para celdas con texto truncado
     * Comentado para evitar interferencia con el tooltip personalizado de filas
     */
    private setupTooltips() {
        // Deshabilitado para evitar interferencia con el tooltip personalizado
        // const cells = document.querySelectorAll('.table td');
        // cells.forEach((cell: any) => {
        //     if (cell.scrollWidth > cell.clientWidth) {
        //         cell.setAttribute('title', cell.textContent?.trim() || '');
        //     }
        // });
    } /**
     * Verifica si una columna tiene acciones
     */
    hasActions(column: DataTableColumn<T>): boolean {
        return !!(column.actions && column.actions.length > 0);
    } /**
     * Ejecuta una acción específica
     */
    executeAction(action: ActionButton<T>, row: T): void {
        // Verificar si el botón está deshabilitado
        if (this.isActionDisabled(action, row)) {
            return;
        }

        // Si es una acción de eliminar, mostrar modal de confirmación
        if (this.isDeleteAction(action)) {
            this.showDeleteConfirmationModal(row, action);
            return;
        }

        // Manejar según el tipo de acción
        switch (action.type) {
            case 'router':
                this.handleRouterAction(action, row);
                break;
            case 'link':
                this.handleLinkAction(action, row);
                break;
            case 'action':
            default:
                this.handleFunctionAction(action, row);
                break;
        }
    }

    /**
     * Maneja acciones de navegación con router
     */
    private handleRouterAction(action: ActionButton<T>, row: T): void {
        if (!action.routerLink) return;

        const routerLink = typeof action.routerLink === 'function' ? action.routerLink(row) : action.routerLink;

        const queryParams = action.routerQueryParams && typeof action.routerQueryParams === 'function' ? action.routerQueryParams(row) : action.routerQueryParams;

        const fragment = action.routerFragment && typeof action.routerFragment === 'function' ? action.routerFragment(row) : action.routerFragment;

        void this.router.navigate([routerLink], {
            queryParams: queryParams || {},
            fragment: fragment || undefined
        });
    }

    /**
     * Maneja acciones de enlaces externos
     */
    private handleLinkAction(action: ActionButton<T>, row: T): void {
        if (!action.href) return;

        const href = typeof action.href === 'function' ? action.href(row) : action.href;

        if (action.target === '_blank') {
            window.open(href, '_blank');
        } else {
            window.location.href = href;
        }
    }

    /**
     * Maneja acciones de función
     */
    private handleFunctionAction(action: ActionButton<T>, row: T): void {
        if (action.action) {
            action.action(row);
        }
    } /**
     * Verifica si un botón de acción debe ser visible
     */
    isActionVisible(action: ActionButton<T>, row: T): boolean {
        return action.visible ? action.visible(row) : true;
    }

    /**
     * Verifica si un botón de acción debe estar deshabilitado
     */
    isActionDisabled(action: ActionButton<T>, row: T): boolean {
        return action.disabled ? action.disabled(row) : false;
    } /**
     * Obtiene el tooltip para un botón de acción
     */
    getActionTooltip(action: ActionButton<T>, row: T): string {
        if (action.tooltip) {
            return typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip;
        }
        return action.label || '';
    }

    // ===== MÉTODOS PARA MODAL DE CONFIRMACIÓN DE ELIMINACIÓN =====

    /**
     * Verifica si una acción es de tipo eliminar
     */
    private isDeleteAction(action: ActionButton<T>): boolean {
        // Verificar por clase CSS
        if (action.cssClass && (action.cssClass.includes('delete') || action.cssClass.includes('remove') || action.cssClass.includes('danger'))) {
            return true;
        }

        // Verificar por icono
        if (action.icon && (action.icon.includes('delete') || action.icon.includes('trash') || action.icon.includes('remove'))) {
            return true;
        }

        // Verificar por label
        if (action.label && (action.label.toLowerCase().includes('eliminar') || action.label.toLowerCase().includes('delete') || action.label.toLowerCase().includes('borrar'))) {
            return true;
        }

        return false;
    }

    /**
     * Muestra el modal de confirmación de eliminación
     */
    private showDeleteConfirmationModal(row: T, action: ActionButton<T>): void {
        this.deleteItemToConfirm = row;
        this.showDeleteModal = true;

        // Prevenir scroll del body
        this.preventBodyScroll();

        // Cerrar otros dropdowns
        this.closeAllDropdowns();
    }

    /**
     * Confirma la eliminación del registro
     */
    confirmDelete(): void {
        if (!this.deleteItemToConfirm) return;

        // Buscar la acción de eliminar en las columnas
        const deleteAction = this.findDeleteActionForItem(this.deleteItemToConfirm);

        if (deleteAction) {
            // Ejecutar la acción original
            this.handleFunctionAction(deleteAction, this.deleteItemToConfirm);
        }

        // Cerrar el modal
        this.closeDeleteModal();
    }

    /**
     * Cancela la eliminación y cierra el modal
     */
    cancelDelete(): void {
        this.closeDeleteModal();
    }

    /**
     * Cierra el modal de eliminación
     */
    private closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.deleteItemToConfirm = null;

        // Restaurar scroll del body
        this.restoreBodyScroll();
    }

    /**
     * Encuentra la acción de eliminar para un item específico
     */
    private findDeleteActionForItem(item: T): ActionButton<T> | null {
        for (const column of this.columns) {
            if (column.actions) {
                for (const action of column.actions) {
                    if (this.isDeleteAction(action)) {
                        return action;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Obtiene el ID del registro para mostrar en el modal
     */
    getItemId(item: T): string {
        // 1. Si hay función personalizada en deleteModalConfig, usarla
        if (this.deleteModalConfig?.customGetter?.id) {
            try {
                return String(this.deleteModalConfig.customGetter.id(item));
            } catch (error) {
                console.warn('Error en función personalizada para ID del modal:', error);
            }
        }

        // 2. Si hay campo específico configurado en deleteModalConfig, usarlo
        if (this.deleteModalConfig?.idField && item && typeof item === 'object') {
            const fieldValue = (item as any)[this.deleteModalConfig.idField];
            if (fieldValue !== null && fieldValue !== undefined) {
                return String(fieldValue);
            }
        }

        // 3. Buscar en las columnas que tengan deleteModal.useAsId = true
        const idColumn = this.columns.find(col => col.deleteModal?.useAsId === true);
        if (idColumn) {
            const value = this.getColumnValue(item, idColumn);
            if (value !== null && value !== undefined) {
                return String(value);
            }
        }

        // 4. Buscar propiedades comunes para ID (comportamiento por defecto)
        const idProperties = ['id', 'ID', 'codigo', 'code', 'key'];

        for (const prop of idProperties) {
            if (item && typeof item === 'object' && prop in item) {
                const value = (item as any)[prop];
                if (value !== null && value !== undefined) {
                    return String(value);
                }
            }
        }

        // 5. Si no encuentra ID, usar la primera columna visible
        const visibleColumns = this.getVisibleColumnDefinitions();
        if (visibleColumns.length > 0) {
            const firstColumnValue = this.getColumnValue(item, visibleColumns[0]);
            return String(firstColumnValue || 'N/A');
        }

        return 'N/A';
    }

    /**
     * Obtiene un valor de referencia adicional del registro para mostrar en el modal
     */
    getItemReference(item: T): string {
        // 1. Si hay función personalizada en deleteModalConfig, usarla
        if (this.deleteModalConfig?.customGetter?.reference) {
            try {
                return String(this.deleteModalConfig.customGetter.reference(item));
            } catch (error) {
                console.warn('Error en función personalizada para referencia del modal:', error);
            }
        }

        // 2. Si hay campo específico configurado en deleteModalConfig, usarlo
        if (this.deleteModalConfig?.referenceField && item && typeof item === 'object') {
            const fieldValue = (item as any)[this.deleteModalConfig.referenceField];
            if (fieldValue !== null && fieldValue !== undefined) {
                return String(fieldValue);
            }
        }

        // 3. Buscar en las columnas que tengan deleteModal.useAsReference = true
        const referenceColumn = this.columns.find(col => col.deleteModal?.useAsReference === true);
        if (referenceColumn) {
            const value = this.getColumnValue(item, referenceColumn);
            if (value !== null && value !== undefined) {
                return String(value);
            }
        }

        // 4. Buscar propiedades comunes para referencia (comportamiento por defecto)
        const refProperties = ['nombre', 'name', 'title', 'titulo', 'descripcion', 'description', 'email'];

        for (const prop of refProperties) {
            if (item && typeof item === 'object' && prop in item) {
                const value = (item as any)[prop];
                if (value !== null && value !== undefined) {
                    return String(value);
                }
            }
        }

        // 5. Si no encuentra referencia, usar la segunda columna visible
        const visibleColumns = this.getVisibleColumnDefinitions();
        if (visibleColumns.length > 1) {
            const secondColumnValue = this.getColumnValue(item, visibleColumns[1]);
            return String(secondColumnValue || 'N/A');
        }

        return 'N/A';
    }

    /**
     * Obtiene el label personalizado para el ID en el modal
     */
    getItemIdLabel(): string {
        // 1. Si hay label en deleteModalConfig, usarlo
        if (this.deleteModalConfig?.idLabel) {
            return this.deleteModalConfig.idLabel;
        }

        // 2. Buscar en las columnas que tengan deleteModal.useAsId = true
        const idColumn = this.columns.find(col => col.deleteModal?.useAsId === true);
        if (idColumn?.deleteModal?.label) {
            return idColumn.deleteModal.label;
        }

        // 3. Si la columna tiene header, usarlo
        if (idColumn?.header) {
            return idColumn.header;
        }

        // 4. Label por defecto
        return 'ID';
    }

    /**
     * Obtiene el label personalizado para la referencia en el modal
     */
    getItemReferenceLabel(): string {
        // 1. Si hay label en deleteModalConfig, usarlo
        if (this.deleteModalConfig?.referenceLabel) {
            return this.deleteModalConfig.referenceLabel;
        }

        // 2. Buscar en las columnas que tengan deleteModal.useAsReference = true
        const referenceColumn = this.columns.find(col => col.deleteModal?.useAsReference === true);
        if (referenceColumn?.deleteModal?.label) {
            return referenceColumn.deleteModal.label;
        }

        // 3. Si la columna tiene header, usarlo
        if (referenceColumn?.header) {
            return referenceColumn.header;
        }

        // 4. Label por defecto
        return 'Nombre';
    }

    // ===== MÉTODOS PARA BOTONES PERSONALIZADOS DEL HEADER =====

    /**
     * Maneja el click en botones personalizados del header
     */
    handleHeaderButtonClick(button: HeaderButton, event: Event): void {
        event.stopPropagation();

        if (button.disabled) return;

        if (button.type === 'dropdown') {
            this.toggleHeaderDropdown(button);
        } else if (button.type === 'button' && button.action) {
            button.action();
        }
    }

    /**
     * Alterna la visibilidad de un dropdown personalizado
     */
    toggleHeaderDropdown(button: HeaderButton): void {
        // Cerrar otros dropdowns
        this.headerButtons.forEach(btn => {
            if (btn.id !== button.id) {
                btn.dropdownOpen = false;
            }
        });

        // Alternar el dropdown actual
        button.dropdownOpen = !button.dropdownOpen;
    }

    /**
     * Maneja el click en items de dropdown personalizados
     */
    handleDropdownItemClick(button: HeaderButton, item: HeaderDropdownItem, event: Event): void {
        event.stopPropagation();

        if (item.disabled) return;

        // Ejecutar la acción del item
        if (item.action) {
            item.action();
        }

        // Cerrar el dropdown
        button.dropdownOpen = false;
    }

    /**
     * Verifica si un botón del header debe estar visible
     */
    isHeaderButtonVisible(button: HeaderButton): boolean {
        return button.visible !== false;
    }

    /**
     * Verifica si un item de dropdown debe estar visible
     */
    isDropdownItemVisible(item: HeaderDropdownItem): boolean {
        return item.visible !== false;
    }

    // ===== MÉTODOS PARA BOTONES PERSONALIZADOS DEL HEADER (existentes) =====

    /**
     * Ejecuta la acción del botón de agregar
     */
    executeAddAction(): void {
        if (!this.addButton || this.isAddButtonDisabled()) {
            return;
        }

        // Manejar según el tipo de acción
        switch (this.addButton.type) {
            case 'router':
                this.handleAddRouterAction();
                break;
            case 'link':
                this.handleAddLinkAction();
                break;
            case 'action':
            default:
                this.handleAddFunctionAction();
                break;
        }
    }

    /**
     * Maneja acciones de navegación con router para el botón de agregar
     */
    private handleAddRouterAction(): void {
        if (!this.addButton?.routerLink) return;

        void this.router.navigate([this.addButton.routerLink], {
            queryParams: this.addButton.routerQueryParams || {},
            fragment: this.addButton.routerFragment || undefined
        });
    }

    /**
     * Maneja acciones de enlaces externos para el botón de agregar
     */
    private handleAddLinkAction(): void {
        if (!this.addButton?.href) return;

        if (this.addButton.target === '_blank') {
            window.open(this.addButton.href, '_blank');
        } else {
            window.location.href = this.addButton.href;
        }
    }

    /**
     * Maneja acciones de función para el botón de agregar
     */
    private handleAddFunctionAction(): void {
        if (this.addButton?.action) {
            this.addButton.action();
        }
    }

    /**
     * Verifica si el botón de agregar debe ser visible
     */
    isAddButtonVisible(): boolean {
        return this.addButton ? this.addButton.visible !== false : false;
    }

    /**
     * Verifica si el botón de agregar debe estar deshabilitado
     */
    isAddButtonDisabled(): boolean {
        return this.addButton?.disabled || false;
    }

    /**
     * Obtiene el tooltip para el botón de agregar
     */
    getAddButtonTooltip(): string {
        return this.addButton?.tooltip || 'Agregar nuevo registro';
    }

    /**
     * Maneja el clic en el botón de key
     */
    handleKeyButton(): void {
        if (this.keyButton?.type === 'router' && this.keyButton.routerLink) {
            void this.router.navigate([this.keyButton.routerLink], {
                queryParams: this.keyButton.routerQueryParams,
                fragment: this.keyButton.routerFragment
            });
        } else if (this.keyButton?.type === 'link' && this.keyButton.href) {
            window.open(this.keyButton.href, this.keyButton.target || '_self');
        } else if (this.keyButton?.action) {
            this.keyButton.action();
        }
    }

    /**
     * Verifica si el botón de key debe ser visible
     */
    isKeyButtonVisible(): boolean {
        return this.keyButton ? this.keyButton.visible !== false : false;
    }

    /**
     * Verifica si el botón de key debe estar deshabilitado
     */
    isKeyButtonDisabled(): boolean {
        return this.keyButton?.disabled || false;
    }

    /**
     * Obtiene el tooltip para el botón de key
     */
    getKeyButtonTooltip(): string {
        return this.keyButton?.tooltip || 'Gestionar llaves y accesos';
    }

    /**
     * Muestra el tooltip con los valores de la primera y segunda columna al hacer hover sobre una fila
     */
    showRowTooltip(event: MouseEvent, item: T): void {
        if (!this.rowTooltip) return;

        const visibleColumns = this.getVisibleColumnDefinitions();
        if (visibleColumns.length < 2) return;

        // Obtener los valores de la primera y segunda columna
        // const firstColumnValue = this.getColumnValue(item, visibleColumns[0]);
        // const secondColumnValue = this.getColumnValue(item, visibleColumns[1]);

        // Formatear los valores
        const firstValue = this.formatColumnValue(item, visibleColumns[0]);
        const secondValue = this.formatColumnValue(item, visibleColumns[1]);

        // Construir el contenido del tooltip
        const tooltipContent = `${visibleColumns[0].header}: ${firstValue} | ${visibleColumns[1].header}: ${secondValue}`;

        // Actualizar el contenido del tooltip
        const tooltipElement = this.rowTooltip.nativeElement;
        const contentElement = tooltipElement.querySelector('.tooltip-content');
        if (contentElement) {
            contentElement.textContent = tooltipContent;
        }

        // Posicionar el tooltip
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        tooltipElement.style.left = `${rect.left + rect.width / 2}px`;
        tooltipElement.style.top = `${rect.top + scrollY - tooltipElement.offsetHeight - 8}px`;

        // Mostrar el tooltip
        tooltipElement.classList.add('show');
    }

    // ===== MÉTODOS PARA MANEJAR SCROLL DEL BODY =====

    /**
     * Previene el scroll del body cuando se abre el modal
     */
    private preventBodyScroll(): void {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
        }
    }

    /**
     * Restaura el scroll del body cuando se cierra el modal
     */
    private restoreBodyScroll(): void {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }

    /**
     * Calcula el ancho de la barra de scroll para compensar el padding
     */
    private getScrollbarWidth(): number {
        if (typeof document === 'undefined') return 0;

        const scrollDiv = document.createElement('div');
        scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }
}
