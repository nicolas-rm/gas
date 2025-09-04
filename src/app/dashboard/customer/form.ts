// Interfaces y constantes de los tabs
export interface CustomberTabInterface {
    label: string;
    value: string;
    icon: string;
}

export const tabs: CustomberTabInterface[] = [
    {
        label: 'Datos Generales',
        value: 'general-data-tab',
        icon: 'ti ti-user'
    },
    {
        label: 'Contrato',
        value: 'contract-tab',
        icon: 'ti ti-file-text'
    },
    {
        label: 'Comisión',
        value: 'commission-tab',
        icon: 'ti ti-percentage'
    },
    {
        label: 'Venta',
        value: 'sale-tab',
        icon: 'ti ti-currency-dollar'
    },
    {
        label: 'Facturación',
        value: 'billing-tab',
        icon: 'ti ti-file-invoice'
    },
    {
        label: 'Contactos',
        value: 'contacts-tab',
        icon: 'ti ti-address-book'
    },
    {
        label: 'INE',
        value: 'ine-tab',
        icon: 'ti ti-id-badge-2'
    },
    {
        label: 'Solicitud de Crédito',
        value: 'credit-request-tab',
        icon: 'ti ti-credit-card'
    }
]
