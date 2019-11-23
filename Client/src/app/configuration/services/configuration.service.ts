import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {SaveChanges} from '../store/configuration.actions';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    /**
     * Service for configuration actions
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
    }

    /**
     * Method to change configuration changes
     */
    public saveConfiguration(): void {
        this.store.dispatch(SaveChanges());
    }
}
