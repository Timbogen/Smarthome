import {UserState} from '../authentication/store/user.reducer';
import {ConfigurationState} from '../configuration/store/configuration.reducer';
import {AdministrationState} from '../core/user/user-administration/store/administration.reducer';

/**
 * All the states put together
 */
export interface AppState {
    administration: AdministrationState;
    configuration: ConfigurationState;
    login: UserState;
}
