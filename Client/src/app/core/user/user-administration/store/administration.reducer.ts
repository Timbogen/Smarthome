import {AdministrationModel} from '../models/administration.model';
import {Action, createReducer, on} from '@ngrx/store';
import {ActionError, ActionSuccess, ChangeUserRole, DeleteUser, GetUsers} from './administration.actions';

export interface AdministrationState {
    users: AdministrationModel[];
}

const initialState: AdministrationState = {
    users: []
};

const reducer = createReducer(initialState,
    on(ActionError, (state, action) => ({...state, users: action.administration.users})),
    on(ActionSuccess, (state, action) => ({...state, users: action.administration.users})),
    on(GetUsers, (state) => state),
    on(DeleteUser, (state) => state),
    on(ChangeUserRole, (state) => state)
);

export function administrationReducer(state: AdministrationState | undefined, action: Action) {
    return reducer(state, action);
}
