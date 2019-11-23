import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {AppState} from './app.state';
import {userReducer} from '../authentication/store/user.reducer';
import {localStorageSync} from 'ngrx-store-localstorage';
import {configurationReducer} from '../configuration/store/configuration.reducer';
import {administrationReducer} from '../core/user/user-administration/store/administration.reducer';

export const appReducers: ActionReducerMap<AppState, any> = {
    administration: administrationReducer,
    configuration: configurationReducer,
    login: userReducer
};

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

/**
 * In the keys you can specify the states that you want to be saved in the local storage
 */
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({
        keys: ['login', 'configuration'],
        rehydrate: true
    })(reducer);
}
