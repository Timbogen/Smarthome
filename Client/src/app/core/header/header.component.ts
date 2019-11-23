import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SettingsComponent} from './settings/settings.component';
import {Router} from '@angular/router';
import {DialogComponentComponent} from './dialog-component/dialog-component.component';
import {ViewDesktopService} from '../main/view-desktop/services/view-desktop.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {UserState} from '../../authentication/store/user.reducer';
import {selectUser} from '../../authentication/store/user.selectors';
import {Logout} from '../../authentication/store/user.actions';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConfigurationHeaderModel} from '../../configuration/models/configuration-header.model';
import {selectConfiguration, selectHeaderConfiguration} from '../../configuration/store/configuration.selectors';
import {SetSelectedComponent} from '../../configuration/store/configuration.actions';
import {SmartComponent} from '../../configuration/models/configuration-information.model';
import {ConfigurationState} from '../../configuration/store/configuration.reducer';
import {ConfigurationService} from '../../configuration/services/configuration.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    /**
     * Configuration of the header
     */
    public headerConfiguration: ConfigurationHeaderModel;
    /**
     * Configuration of the client
     */
    public configuration: ConfigurationState;
    /**
     * The authentication state of the user
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * The header component provides the main controls of the application
     * @param router for changing the route
     * @param dialog for opening dialogs
     * @param configurationService for saving the config
     * @param desktopService information from the home component
     * @param store of the application
     */
    constructor(public router: Router,
                public dialog: MatDialog,
                public configurationService: ConfigurationService,
                public desktopService: ViewDesktopService,
                public store: Store<AppState>) {
        // Get the current user data
        this.store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
        // Get the current user data
        this.store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => (this.configuration = configuration));
        // Get the header configuration
        this.store.pipe(select(selectHeaderConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((config: ConfigurationHeaderModel) => (this.headerConfiguration = config));
    }

    /**
     * Unsubscribe everything on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Method to go back from selecting a specific component
     */
    public showMainView(): void {
        this.store.dispatch(SetSelectedComponent({component: SmartComponent.HOME}));
    }

    /**
     * Method to open the currently selected component's dialog
     */
    public openDialogComponent(): void {
        this.dialog.open(DialogComponentComponent, {
            panelClass: 'my-dialog'
        });
    }

    /**
     * Method to open the view dialog
     */
    public openDialogView(): void {
        this.dialog.open(SettingsComponent, {
            panelClass: 'my-dialog'
        });
    }

    /**
     * Method that changes the state of the present mode
     * (whether the view is rotating automatically or not)
     */
    public changePresentMode(): void {
        this.configuration.desktop.present = !this.configuration.desktop.present;
        this.desktopService.controls.autoRotate = this.configuration.desktop.present;
        this.configurationService.saveConfiguration();
    }

    /**
     * Method that starts a logout action
     */
    public logout(): void {
        this.store.dispatch(Logout());
    }
}
