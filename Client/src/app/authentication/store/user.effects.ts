import {Injectable, OnDestroy} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserService} from '../services/user.service';
import {catchError, exhaustMap, map, takeUntil, tap} from 'rxjs/operators';
import {
    ActionError, AuthenticationSuccess, ChangeEmail, ChangePassword, ActionSuccess, ChangeUsername,
    Login,
    Logout,
    Register, Update,
} from './user.actions';
import {of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {UserState} from './user.reducer';
import {selectUser} from './user.selectors';
import {SnackBarService} from '../../shared/snack-bar/snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class UserEffects implements OnDestroy {

    /**
     * Effects, that will appear, whenever an authentication succeeds
     */
    authenticationSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(AuthenticationSuccess),
                tap(() => this.router.navigate(['home']))
            ),
        {
            dispatch: false
        }
    );

    /**
     * Effects, that will appear, whenever a action succeeds
     */
    actionSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(ActionSuccess),
                tap(action => {
                    // Display the message
                    this.snackBarService.success(action.message);
                })
            ),
        {
            dispatch: false
        }
    );

    /**
     * Effects, that will appear, whenever a action fails
     */
    actionError$ = createEffect(() =>
            this.actions$.pipe(
                ofType(ActionError),
                tap(action => {
                    console.log(action.error);
                    this.snackBarService.error(action.error);
                })
            ),
        {
            dispatch: false
        }
    );

    /**
     * Effects, that will appear, whenever the client is trying to authentication
     */
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Login),
            exhaustMap((action) =>
                this.userService.login(action.credentials).pipe(
                    map((user => AuthenticationSuccess({user}))),
                    catchError(error => {
                        this.user = {
                            _id: '',
                            email: '',
                            isAuthenticated: false,
                            role: '',
                            token: '',
                            username: '',
                            updatedAt: null,
                            createdAt: null
                        };
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear, whenever the client is trying to logout
     */
    logout$ = createEffect(() =>
            this.actions$.pipe(
                ofType(Logout),
                tap(() => this.router.navigate(['login']))
            ),
        {
            dispatch: false
        }
    );

    /**
     * Effects, that will appear, whenever the client is trying to register
     */
    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Register),
            exhaustMap((action) =>
                this.userService.register(action.credentials).pipe(
                    map(user => AuthenticationSuccess({user})),
                    catchError((error) => {
                        this.user = {
                            _id: '',
                            email: '',
                            isAuthenticated: false,
                            role: '',
                            token: '',
                            username: '',
                            updatedAt: null,
                            createdAt: null
                        };
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear on application start
     */
    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Update),
            exhaustMap(() =>
                this.userService.update().pipe(
                    map(message => ActionSuccess({user: this.user, message: message.message})),
                    catchError((error) => {
                        this.user = {
                            _id: '',
                            email: '',
                            isAuthenticated: false,
                            role: '',
                            token: '',
                            username: '',
                            updatedAt: null,
                            createdAt: null
                        };
                        this.router.navigate(['login']);
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear, whenever the user is trying to change his email
     */
    changeEmail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChangeEmail),
            exhaustMap((action) =>
                this.userService.changeEmail(action.property).pipe(
                    map((user => {
                        this.user.email = user.email;
                        this.user.updatedAt = user.updatedAt;
                        return ActionSuccess({user: this.user, message: `E-Mail wurde zu ${user.email} geändert!`});
                    })),
                    catchError((error) => {
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear, whenever the user is trying to change his username
     */
    changeUsername$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChangeUsername),
            exhaustMap((action) =>
                this.userService.changeUsername(action.property).pipe(
                    map((user => {
                        this.user.username = user.username;
                        this.user.updatedAt = user.updatedAt;
                        return ActionSuccess({user: this.user, message: `Name wurde zu ${user.username} geändert!`});
                    })),
                    catchError((error) => {
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear, whenever the user is trying to change his password
     */
    changePassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChangePassword),
            exhaustMap((action) =>
                this.userService.changePassword(action.property).pipe(
                    map((user => {
                        this.user.token = user.token;
                        this.user.updatedAt = user.updatedAt;
                        return ActionSuccess({user: this.user, message: `Passwort wurde erfolgreich geändert!`});
                    })),
                    catchError((error) => {
                        return of(ActionError({error: error.error.message, user: this.user}));
                    })
                )
            )
        )
    );

    /**
     * State of the user
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    constructor(public actions$: Actions,
                public userService: UserService,
                public store: Store<AppState>,
                public router: Router,
                public snackBarService: SnackBarService) {
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
    }

    /**
     * Delete subscriptions on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
