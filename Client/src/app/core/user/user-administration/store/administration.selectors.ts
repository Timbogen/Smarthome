import {AppState} from '../../../../store/app.state';

/**
 * Returns the administration state
 */
export const selectAdministration = (state: AppState) => state.administration;
