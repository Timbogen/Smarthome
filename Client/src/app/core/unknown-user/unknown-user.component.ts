import {Component, OnInit} from '@angular/core';
import {ConfigurationHeaderModel} from '../../configuration/models/configuration-header.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {SetHeaderConfiguration} from '../../configuration/store/configuration.actions';
import {Logout} from '../../authentication/store/user.actions';

@Component({
    selector: 'app-unknown-user',
    templateUrl: './unknown-user.component.html',
    styleUrls: ['./unknown-user.component.scss']
})
export class UnknownUserComponent implements OnInit {

    /**
     * Header configuration for this component
     */
    public readonly headerConfiguration: ConfigurationHeaderModel = {
        backHome: false,
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
     * Component that informs unknown users that they need higher rights
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        // Set the header configuration
        store.dispatch(SetHeaderConfiguration({headerConfiguration: this.headerConfiguration}));
    }

    public ngOnInit(): void {
    }

    /**
     * Method to logout an user
     */
    public logout(): void {
        this.store.dispatch(Logout());
    }
}
