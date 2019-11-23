import {AppState} from '../../store/app.state';
import {createSelector} from '@ngrx/store';
import {ConfigurationState} from './configuration.reducer';

/**
 * Returns the application configuration
 */
export const selectConfiguration = (state: AppState) => state.configuration;

/**
 * Returns the header configuration
 */
export const selectHeaderConfiguration = createSelector(
    selectConfiguration,
    (state: ConfigurationState) => state.header
);
