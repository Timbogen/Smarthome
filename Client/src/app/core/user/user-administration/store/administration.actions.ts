import {createAction, props} from '@ngrx/store';
import {AdministrationState} from './administration.reducer';
import {AdministrationModel} from '../models/administration.model';

enum AdministrationActionTypes {
    ACTION_ERROR = '[Administration] Action Error',
    ACTION_SUCCESS = '[Administration] Action Success',
    GET_USERS = '[Administration] Get Users',
    DELETE_USER = '[Administration] Delete Users',
    CHANGE_USER_ROLE = '[Administration] Change User Role'
}

export const ActionError = createAction(
    AdministrationActionTypes.ACTION_ERROR,
    props<{administration: AdministrationState, error: string}>()
);

export const ActionSuccess = createAction(
    AdministrationActionTypes.ACTION_SUCCESS,
    props<{administration: AdministrationState, message: string, showMessage: boolean}>()
);

export const GetUsers = createAction(
    AdministrationActionTypes.GET_USERS
);

export const DeleteUser = createAction(
    AdministrationActionTypes.DELETE_USER,
    props<{id: string}>()
);

export const ChangeUserRole = createAction(
    AdministrationActionTypes.CHANGE_USER_ROLE,
    props<{user: AdministrationModel, role: string}>()
);
