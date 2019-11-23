import {Component, OnInit} from '@angular/core';
import {ConfigurationHeaderModel} from '../../configuration/models/configuration-header.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {SetHeaderConfiguration} from '../../configuration/store/configuration.actions';

@Component({
    selector: 'app-content-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

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
        user: false,
        userEdit: false
    };

    /**
     * Component that helps the user if he tried to guide to an invalid route
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        // Set the header configuration
        store.dispatch(SetHeaderConfiguration({headerConfiguration: this.headerConfiguration}));
    }

    public ngOnInit(): void {
    }
}
