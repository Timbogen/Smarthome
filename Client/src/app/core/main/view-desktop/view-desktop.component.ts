import {Component, OnDestroy} from '@angular/core';
import {ConfigurationHeaderModel} from '../../../configuration/models/configuration-header.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {SetHeaderConfiguration, SetSelectedComponent} from '../../../configuration/store/configuration.actions';
import {Subject} from 'rxjs';
import {ConfigurationState} from '../../../configuration/store/configuration.reducer';
import {takeUntil} from 'rxjs/operators';
import {selectConfiguration} from '../../../configuration/store/configuration.selectors';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {ConfigurationService} from '../../../configuration/services/configuration.service';
import {SmartComponent} from '../../../configuration/models/configuration-information.model';

/**
 * Header configuration for this component
 */
export const headerConfiguration: ConfigurationHeaderModel = {
    backHome: false,
    backMain: false,
    edit: true,
    information: false,
    logo: true,
    present: true,
    title: true,
    user: true,
    userEdit: true
};
/**
 * Header configuration for this component when a smart component is selected
 */
export const selectionConfiguration: ConfigurationHeaderModel = {
    backHome: false,
    backMain: true,
    edit: false,
    information: true,
    logo: true,
    present: false,
    title: true,
    user: true,
    userEdit: true
};

@Component({
    selector: 'app-view-desktop',
    templateUrl: './view-desktop.component.html',
    styleUrls: ['./view-desktop.component.scss']
})
export class ViewDesktopComponent implements OnDestroy {

    /**
     * The components
     */
    public readonly components = SmartComponent;
    /**
     * Configuration of the application
     */
    public configuration: ConfigurationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component for displaying information on a desktop
     * @param store of the application
     * @param configurationService for configuration actions
     */
    constructor(public store: Store<AppState>, public configurationService: ConfigurationService) {
        // Set the header configuration
        store.dispatch(SetHeaderConfiguration({headerConfiguration}));
        // Get the configuration
        store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => this.configuration = configuration);
    }

    /**
     * Destroy every subscription
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * False if any component is selected
     */
    public isSelected(component: SmartComponent): boolean {
        return this.configuration.desktop.selectedComponent === component;
    }

    /**
     * Selects the specified component
     */
    public selectComponent(component: SmartComponent): void {
        this.store.dispatch(SetSelectedComponent({component}));
    }

    /**
     * Method to change the position of the navigator
     * @param element that was dropped
     */
    public changeNavigatorPosition(element: CdkDrag): void {
        // Assign the parameters
        this.configuration.desktop.navigation.x = element.getFreeDragPosition().x;
        this.configuration.desktop.navigation.y = element.getFreeDragPosition().y;
        // Save the configuration
        this.configurationService.saveConfiguration();
    }
}
