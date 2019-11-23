import {Action, createReducer, on} from '@ngrx/store';
import {
    ActionError,
    AuthenticationSuccess,
    ChangeEmail, ChangePassword,
    ActionSuccess,
    ChangeUsername,
    Login,
    Logout,
    Register, Update
} from './user.actions';

export interface UserState {
    _id: string;
    isAuthenticated: boolean;
    email: string;
    role: string;
    token: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export const initialState: UserState = {
    _id: '',
    isAuthenticated: false,
    email: '',
    username: '',
    role: '',
    token: '',
    createdAt: null,
    updatedAt: null
};

const reducer = createReducer(initialState,
    on(ActionError, (state, action) =>
        ({
            ...state,
            _id: action.user._id,
            isAuthenticated: action.user.isAuthenticated,
            email: action.user.email,
            username: action.user.username,
            role: action.user.role,
            token: action.user.token,
            createdAt: action.user.createdAt,
            updatedAt: action.user.updatedAt
        })
    ),
    on(ActionSuccess, (state, action) => {
            return ({
                ...state,
                _id: action.user._id,
                isAuthenticated: action.user.isAuthenticated,
                email: action.user.email,
                username: action.user.username,
                role: action.user.role,
                token: action.user.token,
                createdAt: action.user.createdAt,
                updatedAt: action.user.updatedAt
            });
        }
    ),
    on(AuthenticationSuccess, (state, action) =>
        ({
            ...state,
            _id: action.user._id,
            isAuthenticated: true,
            email: action.user.email,
            username: action.user.username,
            role: action.user.role,
            token: action.user.token,
            createdAt: action.user.createdAt,
            updatedAt: action.user.updatedAt
        })
    ),
    on(Login, (state) => state),
    on(Logout, (state) =>
        ({...state,
            isAuthenticated: false,
            email: '',
            username: '',
            role: '',
            token: '',
            createdAt: null,
            updatedAt: null
        })
    ),
    on(Register, (state) => state),
    on(Update, (state) => state),
    on(ChangeEmail, (state) => state),
    on(ChangeUsername, (state) => state),
    on(ChangePassword, (state) => state),
);

export function userReducer(state: UserState | undefined, action: Action) {
    return reducer(state, action);
}
