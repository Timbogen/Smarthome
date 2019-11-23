import {ConfigurationHeaderModel} from '../models/configuration-header.model';
import {ConfigurationInformationModel} from '../models/configuration-information.model';
import {ConfigurationDesktopModel} from '../models/configuration-desktop.model';
import {Action, createReducer, on} from '@ngrx/store';
import {
    SaveChanges,
    SetHeaderConfiguration,
    SetSelectedComponent,
    SetSelectedComponentSuccess
} from './configuration.actions';

export interface ConfigurationState {
    header: ConfigurationHeaderModel;
    information: ConfigurationInformationModel;
    desktop: ConfigurationDesktopModel;
}

const initialState: ConfigurationState = {
    header: new ConfigurationHeaderModel(),
    information: new ConfigurationInformationModel(),
    desktop: new ConfigurationDesktopModel(),
};

const reducer = createReducer(initialState,
    on(SetHeaderConfiguration, (state, action) => ({...state, header: action.headerConfiguration})),
    on(SetSelectedComponent, (state) => state),
    on(SetSelectedComponentSuccess, (state, action) => {
        // Set the selected component
        state.desktop.selectedComponent = action.component;
        return state;
    }),
    on(SaveChanges, (state) => state),
);

export function configurationReducer(state: ConfigurationState | undefined, action: Action) {
    return reducer(state, action);
}
