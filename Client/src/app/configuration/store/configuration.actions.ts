import {createAction, props} from '@ngrx/store';
import {ConfigurationHeaderModel} from '../models/configuration-header.model';
import {SmartComponent} from '../models/configuration-information.model';

export enum ConfigurationActionTypes {
    SET_HEADER_CONFIGURATION = '[Configuration] Set Header Configuration',
    SET_SELECTED_COMPONENT = '[Configuration] Set Selected Component',
    SET_SELECTED_COMPONENT_SUCCESS = '[Configuration] Set Selected Component Success',
    SAVE_CHANGES = '[Configuration] Save Changes'
}

export const SetHeaderConfiguration = createAction(
    ConfigurationActionTypes.SET_HEADER_CONFIGURATION,
    props<{headerConfiguration: ConfigurationHeaderModel}>()
);

export const SetSelectedComponent = createAction(
    ConfigurationActionTypes.SET_SELECTED_COMPONENT,
    props<{component: SmartComponent}>()
);

export const SetSelectedComponentSuccess = createAction(
    ConfigurationActionTypes.SET_SELECTED_COMPONENT_SUCCESS,
    props<{component: SmartComponent}>()
);

export const SaveChanges = createAction(
    ConfigurationActionTypes.SAVE_CHANGES
);
