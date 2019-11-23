import {Component, HostListener, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {Subject} from 'rxjs';
import {ConfigurationState} from '../../../configuration/store/configuration.reducer';
import {selectConfiguration} from '../../../configuration/store/configuration.selectors';
import {takeUntil} from 'rxjs/operators';
import {ConfigurationService} from '../../../configuration/services/configuration.service';
import {ViewDesktopService} from '../../main/view-desktop/services/view-desktop.service';
import {FastNavigationModel} from '../../main/view-desktop/models/fast-navigation.model';

@Component({
    selector: 'app-dialog',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
    /**
     * Client configuration
     */
    public configuration: ConfigurationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Dialog for editing the settings of the desktop component
     * @param store of the application
     * @param desktopService for configuring the 3d scene
     * @param configurationService for managing configuration changes
     */
    constructor(public store: Store<AppState>,
                public desktopService: ViewDesktopService,
                public configurationService: ConfigurationService) {
        // Get the configuration
        store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => this.configuration = configuration);
    }

    /**
     * Remove every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Disable all drag events when the dialog is open
     * @param event that happens
     */
    @HostListener('DOMMouseScroll', ['$event'])
    @HostListener('mousewheel', ['$event'])
    @HostListener('mousedown', ['$event'])
    public onClick(event: any): void {
        event.stopPropagation();
    }

    /**
     * Method to change the field of view
     * @param value new field of view
     */
    public changeFOV(value: number): void {
        // Change the value
        this.configuration.desktop.fov = value;
        // Update the camera
        this.desktopService.camera.fov = value;
        this.desktopService.camera.updateProjectionMatrix();
        // Update the local storage
        this.configurationService.saveConfiguration();
    }

    /**
     * Method to reset the fast navigation
     */
    public resetFastNavigation(): void {
        this.configuration.desktop.navigation = new FastNavigationModel();
    }
}
