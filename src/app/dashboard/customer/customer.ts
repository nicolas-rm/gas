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
        icon: 'ti ti-percent'
    },
    {
        label: 'Venta',
        value: 'sale-tab',
        icon: 'ti ti-currency-usd'
    },
    {
        label: 'Facturación',
        value: 'billing-tab',
        icon: 'ti ti-file-invoice'
    },
    {
        label: 'Contactos',
        value: 'contacts-tab',
        icon: 'ti ti-people'
    },
    {
        label: 'INE',
        value: 'ine-tab',
        icon: 'ti ti-id-card'
    },
    {
        label: 'Solicitud de Crédito',
        value: 'credit-request-tab',
        icon: 'ti ti-credit-card'
    }
]
