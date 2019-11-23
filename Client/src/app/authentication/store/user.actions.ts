import {createAction, props} from '@ngrx/store';
import {UserState} from './user.reducer';
import {CredentialsModel} from '../models/credentials.model';
import {ChangeUserModel} from '../models/change-user.model';

enum UserActionTypes {
    ACTION_ERROR = '[User] Action Error',
    ACTION_SUCCESS = '[User] Action Success',
    AUTHENTICATION_SUCCESS = '[User] Authentication Success',
    LOGIN = '[User] Login',
    LOGOUT = '[User] Logout',
    REGISTER = '[User] Register',
    UPDATE = '[User] Update',
    CHANGE_EMAIL = '[User] Change E-Mail',
    CHANGE_USERNAME = '[User] Change Username',
    CHANGE_PASSWORD = '[User] Change Password'
}

export const ActionError = createAction(
    UserActionTypes.ACTION_ERROR,
    props<{error: string, user: UserState}>()
);

export const ActionSuccess = createAction(
    UserActionTypes.ACTION_SUCCESS,
    props<{user: UserState, message: string}>()
);


export const AuthenticationSuccess = createAction(
    UserActionTypes.AUTHENTICATION_SUCCESS,
    props<{user: UserState}>()
);

export const Login = createAction(
    UserActionTypes.LOGIN,
    props<{credentials: CredentialsModel}>()
);

export const Logout = createAction(
    UserActionTypes.LOGOUT
);

export const Register = createAction(
    UserActionTypes.REGISTER,
    props<{credentials: CredentialsModel}>()
);

export const Update = createAction(
    UserActionTypes.UPDATE
);

export const ChangeEmail = createAction(
    UserActionTypes.CHANGE_EMAIL,
    props<{property: ChangeUserModel}>()
);

export const ChangeUsername = createAction(
    UserActionTypes.CHANGE_USERNAME,
    props<{property: ChangeUserModel}>()
);

export const ChangePassword = createAction(
    UserActionTypes.CHANGE_PASSWORD,
    props<{property: ChangeUserModel}>()
);
