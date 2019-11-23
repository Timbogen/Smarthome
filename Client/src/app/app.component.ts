import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {Update} from './authentication/store/user.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    /**
     * Title of the application
     */
    title = 'Smart Home';

    /**
     * The main component of the application
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        // Check if the user was updated
        store.dispatch(Update());
    }
}
