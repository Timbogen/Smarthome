import {AppState} from '../../store/app.state';

/**
 * Returns the current user
 */
export const selectUser = (state: AppState) => state.login;
