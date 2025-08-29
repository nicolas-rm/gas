import { MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

// ⚙️ Keys a persistir en localStorage (ej. solo auth)
const PERSIST_KEYS = ['authentication'];

// Meta-reducer para sync con localStorage
export function localStorageSyncReducer(reducer: any) {
    return localStorageSync({
        keys: PERSIST_KEYS,
        rehydrate: true, // 🔁 Restaura el estado al iniciar la app
        storage: localStorage // Puedes inyectar un storage custom si lo necesitas
    })(reducer);
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];
