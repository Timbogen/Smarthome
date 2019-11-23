import {Injectable, OnDestroy} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, takeUntil, tap} from 'rxjs/operators';
import {ActionError, ActionSuccess, ChangeUserRole, DeleteUser, GetUsers} from './administration.actions';
import {of, Subject} from 'rxjs';
import {AdministrationService} from '../services/administration.service';
import {AdministrationState} from './administration.reducer';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {selectAdministration} from './administration.selectors';
import {AdministrationModel} from '../models/administration.model';
import {SnackBarService} from '../../../../shared/snack-bar/snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class AdministrationEffects implements OnDestroy {

    /**
     * Effects, that will appear, whenever a action succeeds
     */
    actionSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(ActionSuccess),
                tap(action => {
                    // Display the message
                    if (action.showMessage) {
                        this.snackBarService.success(action.message);
                    }
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
                    this.snackBarService.error(action.error);
                })
            ),
        {
            dispatch: false
        }
    );

    /**
     * Effects, that will appear when an admin needs all users
     */
    getUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GetUsers),
            exhaustMap(() =>
                this.administrationService.getUsers().pipe(
                    map((users => {
                        const administration: AdministrationState = {users};
                        return ActionSuccess({administration, message: '', showMessage: false});
                    })),
                    catchError((error) => {
                        const administration: AdministrationState = {users: []};
                        return of(ActionError({administration, error: error.error.message}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear when an admin changes a users role
     */
    changeUserRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChangeUserRole),
            exhaustMap((action) =>
                this.administrationService.changeRole({_id: action.user._id, role: action.role, username: action.user.username}).pipe(
                    map((response => {
                        // Modify the role
                        action.user.role = response.role;
                        return ActionSuccess({administration: this.administration, message: response.message, showMessage: true});
                    })),
                    catchError((error) => {
                        const administration: AdministrationState = {users: []};
                        return of(ActionError({administration, error: error.error.message}));
                    })
                )
            )
        )
    );

    /**
     * Effects, that will appear when an admin changes a users role
     */
    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteUser),
            exhaustMap((action) =>
                this.administrationService.deleteUser(action.id).pipe(
                    map((response => {
                        // Modify the users
                        this.administration.users.forEach((user: AdministrationModel, index: number) => {
                            if (user._id === action.id) {
                                this.administration.users.splice(index, 1);
                            }
                        });
                        return ActionSuccess({administration: this.administration, message: response.message, showMessage: true});
                    })),
                    catchError((error) => {
                        const administration: AdministrationState = {users: []};
                        return of(ActionError({administration, error: error.error.message}));
                    })
                )
            )
        )
    );

    /**
     * Administration state
     */
    public administration: AdministrationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    constructor(public actions$: Actions,
                public store: Store<AppState>,
                public snackBarService: SnackBarService,
                public administrationService: AdministrationService) {
        store.pipe(select(selectAdministration), takeUntil(this.unsubscribe$))
            .subscribe((administration: AdministrationState) => (this.administration = administration));
    }

    /**
     * Delete every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
