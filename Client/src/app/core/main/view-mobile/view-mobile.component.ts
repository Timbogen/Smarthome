import {Component} from '@angular/core';
import {ConfigurationHeaderModel} from '../../../configuration/models/configuration-header.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {SetHeaderConfiguration} from '../../../configuration/store/configuration.actions';

@Component({
    selector: 'app-view-mobile',
    templateUrl: './view-mobile.component.html',
    styleUrls: ['./view-mobile.component.scss']
})
export class ViewMobileComponent {

    /**
     * Header configuration for this component
     */
    public readonly headerConfiguration: ConfigurationHeaderModel = {
        backHome: false,
        backMain: false,
        edit: true,
        information: false,
        logo: true,
        present: false,
        title: true,
        user: true,
        userEdit: true
    };

    /**
     * Component for displaying information on mobile devices
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        // Set the header configuration
        store.dispatch(SetHeaderConfiguration({headerConfiguration: this.headerConfiguration}));
    }
}
