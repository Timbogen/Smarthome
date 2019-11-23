import {Component, OnDestroy} from '@angular/core';
import {ConfigurationHeaderModel} from '../../configuration/models/configuration-header.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {SetHeaderConfiguration} from '../../configuration/store/configuration.actions';
import {Router} from '@angular/router';
import {UserState} from '../../authentication/store/user.reducer';
import {Subject} from 'rxjs';
import {selectUser} from '../../authentication/store/user.selectors';
import {takeUntil} from 'rxjs/operators';
import {UserService} from '../../authentication/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy {

    /**
     * Header configuration for this component
     */
    public readonly headerConfiguration: ConfigurationHeaderModel = {
        backHome: true,
        backMain: false,
        edit: false,
        information: false,
        logo: true,
        present: false,
        title: true,
        user: true,
        userEdit: false
    };
    /**
     * Date of creation
     */
    public createdAt: string;
    /**
     * Date of the last update
     */
    public updatedAt: string;
    /**
     * The user information
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component to show the user data
     * @param store of the application
     * @param router to change the route
     * @param authenticationService for managing the users views
     */
    constructor(public store: Store<AppState>,
                public router: Router,
                public authenticationService: UserService) {
        // Set the header configuration
        store.dispatch(SetHeaderConfiguration({headerConfiguration: this.headerConfiguration}));
        // Get the user information
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => {
            // Get the dates
            if (user) {
                this.createdAt = new Date(user.createdAt).toLocaleDateString();
                this.updatedAt = new Date(user.updatedAt).toLocaleDateString();
            }
            // Get the user information
            this.user = user;
        });
    }

    /**
     * Destroy every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
