import {Component, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {Subject} from 'rxjs';
import {AdministrationState} from './store/administration.reducer';
import {ChangeUserRole, DeleteUser, GetUsers} from './store/administration.actions';
import {selectAdministration} from './store/administration.selectors';
import {takeUntil} from 'rxjs/operators';
import {AdministrationModel} from './models/administration.model';
import {ADMIN, MEMBER, UNKNOWN} from '../../../authentication/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-user-administration',
    templateUrl: './user-administration.component.html',
    styleUrls: ['./user-administration.component.scss']
})
export class UserAdministrationComponent implements OnDestroy {

    /**
     * Administrator role value
     */
    public readonly administrator = ADMIN;
    /**
     * Member role value
     */
    public readonly member = MEMBER;
    /**
     * Administrator role value
     */
    public readonly unknown = UNKNOWN;
    /**
     * New role
     */
    public role = MEMBER;
    /**
     * Data of all the users
     */
    public administration: AdministrationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component for managing all the users
     * @param store of the application
     * @param dialog for confirmation
     */
    constructor(public store: Store<AppState>,
                public dialog: MatDialog) {
        // Let the store get the user list
        store.dispatch(GetUsers());
        // Access the data
        store.pipe(select(selectAdministration), takeUntil(this.unsubscribe$))
            .subscribe((administration: AdministrationState) => (this.administration = administration));
    }

    /**
     * Destroy every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Delete a user
     * @param user information
     */
    public openConfirmationDialog(user: AdministrationModel): void {
        this.dialog.open(ConfirmationDialogComponent, {
            panelClass: 'my-dialog',
            width: '350px',
            data: {
                cancel: 'Abbrechen',
                submit: 'Löschen',
                header: 'Benutzer löschen',
                description: `Wollen sie den Benutzer ${user.username} wirklich entfernen?`,
                callback: () => {
                    this.store.dispatch(DeleteUser({id: user._id}));
                    this.dialog.closeAll();
                }
            }
        });
    }

    /**
     * Change role of a user
     * @param user information
     */
    public changeRole(user: AdministrationModel): void {
        this.store.dispatch(ChangeUserRole({user, role: this.role}));
    }
}
