// Customer NgRx Barrel Export
// Este archivo centraliza todas las exportaciones del módulo NgRx de Customer

// ========== MODELS ==========
export * from './customer.models';

// ========== STATE ==========
export * from './customer.state';

// ========== ACTIONS ==========
export * from './customer.actions';

// ========== SELECTORS ==========
export * from './customer.selectors';

// ========== REDUCER ==========
export * from './customer.reducer';

// ========== EFFECTS ==========
export * from './customer.effects';

// ========== INDIVIDUAL SECTION EFFECTS ==========
// Effects separados por sección para mejor organización y mantenimiento

// General Data Effects
export {
    loadGeneralDataEffect,
    saveGeneralDataEffect
} from '../components/general-data/ngrx/general-data.effects';

// Contract Data Effects
export {
    loadContractDataEffect,
    saveContractDataEffect,
    saveContractDataFromStoreEffect
} from '../components/contract/ngrx/contract.effects';

// Commission Data Effects
export {
    loadCommissionDataEffect,
    saveCommissionDataEffect,
    saveCommissionDataFromStoreEffect
} from '../components/commission/ngrx/commission.effects';

// Sale Data Effects
export {
    loadSaleDataEffect,
    saveSaleDataEffect,
    saveSaleDataFromStoreEffect
} from '../components/sale/ngrx/sale.effects';

// Billing Data Effects
export {
    loadBillingDataEffect,
    saveBillingDataEffect,
    saveBillingDataFromStoreEffect
} from '../components/billing/ngrx/billing.effects';

// Contacts Data Effects
export {
    loadContactsDataEffect,
    saveContactsDataEffect
} from '../components/contacts/ngrx/contacts.effects';

// INE Data Effects
export {
    loadIneDataEffect,
    saveIneDataEffect
} from '../components/ine/ngrx/ine.effects';

// Credit Request Data Effects
export {
    loadCreditRequestDataEffect,
    saveCreditRequestDataEffect
} from '../components/credit-request/ngrx/credit-request.effects';

// ========== RE-EXPORTS FOR LEGACY COMPATIBILITY ==========
// Exports específicos para mantener compatibilidad con el código existente

// General Data
export { 
    GeneralDataPageActions, 
    GeneralDataApiActions 
} from './customer.actions';
export { 
    selectGeneralData, 
    selectGeneralDataState, 
    selectGeneralDataLoading,
    selectGeneralDataSaving,
    selectGeneralDataError,
    selectGeneralDataField 
} from './customer.selectors';

// Contract Data
export { 
    ContractDataPageActions, 
    ContractDataApiActions 
} from './customer.actions';
export { 
    selectContractData, 
    selectContractDataState, 
    selectContractDataLoading,
    selectContractDataSaving,
    selectContractDataError,
    selectContractDataField 
} from './customer.selectors';

// Commission Data
export { 
    CommissionDataPageActions, 
    CommissionDataApiActions 
} from './customer.actions';
export { 
    selectCommissionData, 
    selectCommissionDataState, 
    selectCommissionDataLoading,
    selectCommissionDataSaving,
    selectCommissionDataError,
    selectCommissionDataField 
} from './customer.selectors';

// Sale Data
export { 
    SaleDataPageActions, 
    SaleDataApiActions 
} from './customer.actions';
export { 
    selectSaleData, 
    selectSaleDataState, 
    selectSaleDataLoading,
    selectSaleDataSaving,
    selectSaleDataError,
    selectSaleDataField 
} from './customer.selectors';

// Billing Data
export { 
    BillingDataPageActions, 
    BillingDataApiActions 
} from './customer.actions';
export { 
    selectBillingData, 
    selectBillingDataState, 
    selectBillingDataLoading,
    selectBillingDataSaving,
    selectBillingDataError,
    selectBillingDataField 
} from './customer.selectors';

// Contacts Data
export { 
    ContactsDataPageActions, 
    ContactsDataApiActions 
} from './customer.actions';
export { 
    selectContactsData, 
    selectContactsDataState, 
    selectContactsDataLoading,
    selectContactsDataSaving,
    selectContactsDataError 
} from './customer.selectors';

// INE Data
export { 
    IneDataPageActions, 
    IneDataApiActions 
} from './customer.actions';
export { 
    selectIneData, 
    selectIneDataState, 
    selectIneDataLoading,
    selectIneDataSaving,
    selectIneDataError,
    selectIneDataField 
} from './customer.selectors';

// Credit Request Data
export { 
    CreditRequestDataPageActions, 
    CreditRequestDataApiActions 
} from './customer.actions';
export { 
    selectCreditRequestData, 
    selectCreditRequestDataState, 
    selectCreditRequestDataLoading,
    selectCreditRequestDataSaving,
    selectCreditRequestDataError,
    selectCreditRequestDataField 
} from './customer.selectors';
