export interface HeaderButton {
    id: string;
    label?: string;
    icon?: string;
    tooltip?: string;
    cssClass?: string;
    type: 'button' | 'dropdown';
    disabled?: boolean;
    visible?: boolean;

    // Para botones simples
    action?: () => void;

    // Para dropdowns
    dropdownItems?: HeaderDropdownItem[];
    dropdownHeader?: string;
    dropdownOpen?: boolean;
}

export interface HeaderDropdownItem {
    id: string;
    label: string;
    icon?: string;
    action: () => void;
    disabled?: boolean;
    visible?: boolean;
}
