import { Injectable } from '@angular/core';

export class Sidebar {
    title: string;
    icon?: string;
    route?: string;
    children?: Sidebar[];

    constructor(title: string, icon: string, route: string, children: Sidebar[]) {
        this.title = title;
        this.icon = icon;
        this.route = route;
        this.children = children;
    }
}

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    // Sidebar
    public readonly sidebarMenu: Sidebar[] = [
        // Dashboard Principal
        {
            title: 'Dashboard',
            icon: 'ti ti-home',
            children: [
                {
                    title: 'Métricas',
                    icon: 'ti ti-chart-pie',
                    route: '/panel'
                }
            ]
        },

        // Gestión de Clientes
        {
            title: 'Gestión de Clientes',
            icon: 'ti ti-users',
            children: [
                {
                    title: 'Registro',
                    icon: 'ti ti-user-plus',
                    children: [
                        {
                            title: 'Alta de Clientes',
                            icon: 'ti ti-user-star',
                            route: '/panel/alta-clientes'
                        },
                        {
                            title: 'Alta de Usuarios',
                            icon: 'ti ti-user-plus',
                            route: '/panel/alta-usuarios'
                        },
                        {
                            title: 'Alta de Choferes',
                            icon: 'ti ti-steering-wheel',
                            route: '/panel/alta-choferes'
                        },
                        {
                            title: 'Alta de Vehículos',
                            icon: 'ti ti-car',
                            route: '/panel/alta-vehiculos'
                        },
                        {
                            title: 'Alta de Grupos',
                            icon: 'ti ti-users-plus',
                            route: '/panel/alta-grupos'
                        }
                    ]
                },
                {
                    title: 'Catálogos',
                    icon: 'ti ti-address-book',
                    children: [
                        {
                            title: 'Catálogo de Clientes',
                            icon: 'ti ti-address-book',
                            route: '/panel/catalogo-clientes'
                        },
                        {
                            title: 'Catálogo de Usuarios',
                            icon: 'ti ti-users-group',
                            route: '/panel/catalogo-usuarios'
                        },
                        {
                            title: 'Catálogo de Choferes',
                            icon: 'ti ti-id-badge-2',
                            route: '/panel/catalogo-choferes'
                        },
                        {
                            title: 'Catálogo de Usuarios Web',
                            icon: 'ti ti-world',
                            route: '/panel/catalogo-usuarios-web'
                        }
                    ]
                },
                {
                    title: 'Configuración',
                    icon: 'ti ti-settings',
                    children: [
                        {
                            title: 'Centro de Costos',
                            icon: 'ti ti-building-bank',
                            route: '/panel/centro-costos'
                        },
                        {
                            title: 'Tipos de Comisiones',
                            icon: 'ti ti-percentage',
                            route: '/panel/tipos-comisiones'
                        }
                    ]
                }
            ]
        },

        // Gestión de Tarjetas
        {
            title: 'Gestión de Tarjetas',
            icon: 'ti ti-credit-card',
            children: [
                {
                    title: 'Administración',
                    icon: 'ti ti-settings',
                    children: [
                        {
                            title: 'Configuración de Tarjetas',
                            icon: 'ti ti-credit-card',
                            route: '/panel/configuracion-tarjetas'
                        },
                        {
                            title: 'Generación de Tarjetas',
                            icon: 'ti ti-credit-card-plus',
                            route: '/panel/generacion-tarjetas'
                        },
                        {
                            title: 'Catálogo de Tarjetas',
                            icon: 'ti ti-cards',
                            route: '/panel/catalogo-tarjetas'
                        }
                    ]
                },
                {
                    title: 'Operaciones',
                    icon: 'ti ti-arrows-exchange',
                    children: [
                        {
                            title: 'Autorización Telefónica',
                            icon: 'ti ti-phone',
                            route: '/panel/autorizacion-telefonica'
                        },
                        {
                            title: 'Motivo de Autorización Telefónica',
                            icon: 'ti ti-message-question',
                            route: '/panel/motivo-autorizacion'
                        },
                        {
                            title: 'Traspasos de Saldos',
                            icon: 'ti ti-arrows-exchange',
                            route: '/panel/traspasos-saldos'
                        },
                        {
                            title: 'Anulación de Operaciones',
                            icon: 'ti ti-ban',
                            route: '/panel/anulacion-operaciones'
                        },
                        {
                            title: 'Cambiar Límites de Crédito',
                            icon: 'ti ti-arrows-maximize',
                            route: '/panel/cambiar-limites-credito'
                        }
                    ]
                },
                {
                    title: 'Herramientas',
                    icon: 'ti ti-tools',
                    children: [
                        {
                            title: 'Formatos TXT',
                            icon: 'ti ti-file-type-txt',
                            route: '/panel/formatos-txt'
                        },
                        {
                            title: 'Reportes SAT',
                            icon: 'ti ti-report',
                            route: '/panel/reportes-sat'
                        }
                    ]
                }
            ]
        },

        // Gestión de Estaciones
        {
            title: 'Gestión de Estaciones',
            icon: 'ti ti-gas-station',
            children: [
                {
                    title: 'Alta de Grupos',
                    icon: 'ti ti-users-plus',
                    route: '/panel/gasolineras/alta-grupos'
                },
                {
                    title: 'Alta de Gasolineras',
                    icon: 'ti ti-gas-station',
                    route: '/panel/gasolineras/alta-gasolineras'
                },
                {
                    title: 'Estación Mapa',
                    icon: 'ti ti-map',
                    route: '/panel/gasolineras/estacion-mapa'
                },
                {
                    title: 'Estado de Cuenta Estaciones',
                    icon: 'ti ti-file-dollar',
                    route: '/panel/gasolineras/estado-cuenta-estaciones'
                },
                {
                    title: 'Cargo a Cta. Gasolineras',
                    icon: 'ti ti-arrow-bar-up',
                    route: '/panel/gasolineras/cargo-cuenta'
                },
                {
                    title: 'Abono de Gasolineras',
                    icon: 'ti ti-arrow-bar-down',
                    route: '/panel/gasolineras/abono'
                },
                {
                    title: 'Abonos Múltiples a Estaciones',
                    icon: 'ti ti-arrows-double-ne-sw',
                    route: '/panel/gasolineras/abonos-multiples'
                },
                {
                    title: 'Documentos Estaciones',
                    icon: 'ti ti-file-description',
                    route: '/panel/gasolineras/documentos'
                },
                {
                    title: 'Facturación Libre',
                    icon: 'ti ti-file-invoice',
                    route: '/panel/gasolineras/facturacion-libre'
                },
                {
                    title: 'Listado de Facturación Libre',
                    icon: 'ti ti-list-details',
                    route: '/panel/gasolineras/listado-facturacion-libre'
                }
            ]
        },

        // Cartera de Clientes
        {
            title: 'Cartera de Clientes',
            icon: 'ti ti-wallet',
            children: [
                {
                    title: 'Configuración',
                    icon: 'ti ti-settings',
                    children: [
                        {
                            title: 'Conceptos Ingresos',
                            icon: 'ti ti-list-numbers',
                            route: '/panel/cartera/conceptos-ingresos'
                        }
                    ]
                },
                {
                    title: 'Movimientos',
                    icon: 'ti ti-arrows-exchange',
                    children: [
                        {
                            title: 'Cargos a Cuentas Clientes',
                            icon: 'ti ti-arrow-bar-up',
                            route: '/panel/cartera/cargos-cuentas'
                        },
                        {
                            title: 'Abono a Cuenta',
                            icon: 'ti ti-arrow-bar-down',
                            route: '/panel/cartera/abono-cuenta'
                        }
                    ]
                },
                {
                    title: 'Estados de Cuenta',
                    icon: 'ti ti-file-dollar',
                    children: [
                        {
                            title: 'Estado de Cuenta Electrónica',
                            icon: 'ti ti-file-dollar',
                            route: '/panel/cartera/estado-cuenta-electronica'
                        },
                        {
                            title: 'Estado de Cuenta Papel',
                            icon: 'ti ti-file-text',
                            route: '/panel/cartera/estado-cuenta-papel'
                        },
                        {
                            title: 'Cancelar Estado de Cuenta',
                            icon: 'ti ti-ban',
                            route: '/panel/cartera/cancelar-estado-cuenta'
                        },
                        {
                            title: 'Relacionar Estado de Cuenta con Facturas',
                            icon: 'ti ti-link',
                            route: '/panel/cartera/relacionar-estado-facturas'
                        }
                    ]
                },
                {
                    title: 'Facturación',
                    icon: 'ti ti-file-invoice',
                    children: [
                        {
                            title: 'Generar Complemento de Pago',
                            icon: 'ti ti-file-invoice',
                            route: '/panel/cartera/generar-complemento-pago'
                        },
                        {
                            title: 'Listado de Complementos de Pago',
                            icon: 'ti ti-list-details',
                            route: '/panel/cartera/listado-complementos-pago'
                        }
                    ]
                },
                {
                    title: 'Cobranza',
                    icon: 'ti ti-briefcase',
                    children: [
                        {
                            title: 'Gestión de Cobranza',
                            icon: 'ti ti-briefcase',
                            route: '/panel/cartera/gestion-cobranza'
                        },
                        {
                            title: 'Documentos de Clientes',
                            icon: 'ti ti-file-description',
                            route: '/panel/cartera/documentos-clientes'
                        },
                        {
                            title: 'Reporte Contable de Ingresos',
                            icon: 'ti ti-report-money',
                            route: '/panel/cartera/reporte-contable-ingresos'
                        }
                    ]
                }
            ]
        },

        // Cuentas Bancarias
        {
            title: 'Cuentas Bancarias',
            icon: 'ti ti-building-bank',
            route: '/panel/cuentas-bancarias'
        },

        // Reportes y Análisis
        {
            title: 'Reportes y Análisis',
            icon: 'ti ti-chart-bar',
            children: [
                {
                    title: 'Transacciones',
                    icon: 'ti ti-arrows-exchange',
                    children: [
                        {
                            title: 'Reporte Transacción Clientes',
                            icon: 'ti ti-report',
                            route: '/panel/reportes/transaccion-clientes'
                        },
                        {
                            title: 'Transacciones Estaciones',
                            icon: 'ti ti-report',
                            route: '/panel/reportes/transacciones-estaciones'
                        },
                        {
                            title: 'Transacciones Telefónicas',
                            icon: 'ti ti-phone',
                            route: '/panel/reportes/transacciones-telefonicas'
                        }
                    ]
                },
                {
                    title: 'Movimientos Financieros',
                    icon: 'ti ti-cash',
                    children: [
                        {
                            title: 'Cargos',
                            icon: 'ti ti-arrow-bar-up',
                            route: '/panel/reportes/cargos'
                        },
                        {
                            title: 'Reporte de Abonos',
                            icon: 'ti ti-arrow-bar-down',
                            route: '/panel/reportes/abonos'
                        },
                        {
                            title: 'Abono Mensuales Clientes',
                            icon: 'ti ti-arrow-bar-down',
                            route: '/panel/reportes/abono-mensual-clientes'
                        }
                    ]
                },
                {
                    title: 'Saldos y Cartera',
                    icon: 'ti ti-wallet',
                    children: [
                        {
                            title: 'Saldo Clientes Débito',
                            icon: 'ti ti-wallet',
                            route: '/panel/reportes/saldo-clientes-debito'
                        },
                        {
                            title: 'Saldo Clientes Crédito',
                            icon: 'ti ti-wallet',
                            route: '/panel/reportes/saldo-clientes-credito'
                        },
                        {
                            title: 'Saldos Cartera de Crédito',
                            icon: 'ti ti-wallet',
                            route: '/panel/reportes/saldos-cartera-credito'
                        },
                        {
                            title: 'Saldo Cartera Estaciones',
                            icon: 'ti ti-wallet',
                            route: '/panel/reportes/saldo-cartera-estaciones'
                        },
                        {
                            title: 'Saldos por Tarjetas',
                            icon: 'ti ti-credit-card',
                            route: '/panel/reportes/saldos-tarjetas'
                        },
                        {
                            title: 'Reporte Saldos Bancos',
                            icon: 'ti ti-building-bank',
                            route: '/panel/reportes/saldos-bancos'
                        }
                    ]
                },
                {
                    title: 'Ventas y Comisiones',
                    icon: 'ti ti-chart-pie',
                    children: [
                        {
                            title: 'Consolidado de Ventas',
                            icon: 'ti ti-chart-bar',
                            route: '/panel/reportes/consolidado-ventas'
                        },
                        {
                            title: 'Comisiones por Estaciones',
                            icon: 'ti ti-percentage',
                            route: '/panel/reportes/comisiones-estaciones'
                        },
                        {
                            title: 'Reporte Consolidado Comisiones',
                            icon: 'ti ti-percentage',
                            route: '/panel/reportes/consolidado-comisiones'
                        }
                    ]
                },
                {
                    title: 'Facturación',
                    icon: 'ti ti-file-invoice',
                    children: [
                        {
                            title: 'Reporte de Facturación Automática',
                            icon: 'ti ti-file-invoice',
                            route: '/panel/reportes/facturacion-automatica'
                        }
                    ]
                },
                {
                    title: 'Control y Auditoría',
                    icon: 'ti ti-shield-check',
                    children: [
                        {
                            title: 'Reporte de Rechazos',
                            icon: 'ti ti-ban',
                            route: '/panel/reportes/rechazos'
                        },
                        {
                            title: 'Reporte Histórico de Autorización',
                            icon: 'ti ti-history',
                            route: '/panel/reportes/historico-autorizacion'
                        },
                        {
                            title: 'Reporte Tarjetas Eliminadas',
                            icon: 'ti ti-credit-card-off',
                            route: '/panel/reportes/tarjetas-eliminadas'
                        },
                        {
                            title: 'Reporte Reposición de Tarjetas',
                            icon: 'ti ti-credit-card',
                            route: '/panel/reportes/reposicion-tarjetas'
                        },
                        {
                            title: 'Bitácora',
                            icon: 'ti ti-notebook',
                            route: '/panel/reportes/bitacora'
                        },
                        {
                            title: 'Reporte Bitácora Web',
                            icon: 'ti ti-notebook',
                            route: '/panel/reportes/bitacora-web'
                        }
                    ]
                },
                {
                    title: 'Análisis Especializados',
                    icon: 'ti ti-chart-dots',
                    children: [
                        {
                            title: 'Acumulados',
                            icon: 'ti ti-chart-pie',
                            route: '/panel/reportes/acumulados'
                        },
                        {
                            title: 'Odómetro',
                            icon: 'ti ti-dashboard',
                            route: '/panel/reportes/odometro'
                        },
                        {
                            title: 'Balance General de Cuentas',
                            icon: 'ti ti-balance',
                            route: '/panel/reportes/balance-general'
                        }
                    ]
                }
            ]
        },

        // Configuración del Sistema
        {
            title: 'Configuración del Sistema',
            icon: 'ti ti-settings',
            children: [
                {
                    title: 'Usuarios y Accesos',
                    icon: 'ti ti-user-cog',
                    children: [
                        {
                            title: 'Alta de Usuarios',
                            icon: 'ti ti-user-plus',
                            route: '/panel/sistema/alta-usuarios'
                        },
                        {
                            title: 'Alta de Vendedores',
                            icon: 'ti ti-user-star',
                            route: '/panel/sistema/alta-vendedores'
                        }
                    ]
                },
                {
                    title: 'Configuración General',
                    icon: 'ti ti-settings',
                    children: [
                        {
                            title: 'Configuración',
                            icon: 'ti ti-settings',
                            route: '/panel/sistema/configuracion'
                        },
                        {
                            title: 'Configuración de Precios',
                            icon: 'ti ti-currency-dollar',
                            route: '/panel/sistema/configuracion-precios'
                        }
                    ]
                },
                {
                    title: 'Catálogos Base',
                    icon: 'ti ti-database',
                    children: [
                        {
                            title: 'Alta de Combustibles',
                            icon: 'ti ti-gas-station',
                            route: '/panel/sistema/alta-combustibles'
                        },
                        {
                            title: 'Bancos',
                            icon: 'ti ti-building-bank',
                            route: '/panel/sistema/bancos'
                        },
                        {
                            title: 'Formas de Pago',
                            icon: 'ti ti-cash',
                            route: '/panel/sistema/formas-pago'
                        }
                    ]
                },
                {
                    title: 'Facturación y Certificados',
                    icon: 'ti ti-certificate',
                    children: [
                        {
                            title: 'Certificados y Folios',
                            icon: 'ti ti-certificate',
                            route: '/panel/sistema/certificados-folios'
                        }
                    ]
                }
            ]
        }
    ];

    constructor() {}
}
