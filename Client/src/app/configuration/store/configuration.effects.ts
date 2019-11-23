import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SetHeaderConfiguration, SetSelectedComponent, SetSelectedComponentSuccess} from './configuration.actions';
import {tap} from 'rxjs/operators';
import {ViewDesktopService} from '../../core/main/view-desktop/services/view-desktop.service';
import {SmartComponent} from '../models/configuration-information.model';
import {headerConfiguration, selectionConfiguration} from '../../core/main/view-desktop/view-desktop.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationEffects {

    setSelectedComponent$ = createEffect(() =>
            this.actions$.pipe(
                ofType(SetSelectedComponent),
                tap(action => {
                    // Find the component
                    switch (action.component) {
                        case SmartComponent.CAMERA:
                            this.zoomIntoComponent(action.component, 0.16, 10.68, 20.17);
                            break;

                        case SmartComponent.CELLAR:
                            this.zoomIntoComponent(action.component, 15.57, 2.99, 1.59);
                            break;

                        case SmartComponent.GARAGE:
                            this.zoomIntoComponent(action.component, -12.18, 5.77, -5.51);
                            break;

                        default:
                            // Activate the movement
                            this.desktopService.controls.enabled = true;
                            this.desktopService.controls.autoRotate = this.autoRotate;
                            // Signalize successful execution
                            this.store.dispatch(SetSelectedComponentSuccess({component: action.component}));
                            // Set the header configuration
                            this.store.dispatch(SetHeaderConfiguration({headerConfiguration}));
                            this.desktopService.zoomIn(this.desktopService.homePosition.x,
                                this.desktopService.homePosition.y, this.desktopService.homePosition.z);
                    }
                })
            ),
        {
            dispatch: false
        }
    );

    /**
     * Was auto rotate on before
     */
    public autoRotate: boolean;

    constructor(public actions$: Actions,
                public desktopService: ViewDesktopService,
                public store: Store<AppState>) {
    }

    /**
     * Method for zooming on a component
     * @param component that the user is zooming on
     * @param x position
     * @param y position
     * @param z position
     */
    public zoomIntoComponent(component: SmartComponent, x: number, y: number, z: number): void {
        // Save the previous rotation state
        if (this.desktopService.isActive(SmartComponent.HOME)) {
            this.autoRotate = this.desktopService.controls.autoRotate;
        }
        // Disable any movement
        this.desktopService.controls.enabled = false;
        this.desktopService.controls.autoRotate = false;
        // Save the position
        if (this.desktopService.camera !== undefined && this.desktopService.isActive(SmartComponent.HOME)) {
            this.desktopService.homePosition.x = this.desktopService.camera.position.x;
            this.desktopService.homePosition.y = this.desktopService.camera.position.y;
            this.desktopService.homePosition.z = this.desktopService.camera.position.z;
        }
        // Zoom in
        this.desktopService.zoomIn(x, y, z);
        // Signalize successful execution
        this.store.dispatch(SetSelectedComponentSuccess({component}));
        // Set the header configuration
        this.store.dispatch(SetHeaderConfiguration({headerConfiguration: selectionConfiguration}));
    }
}
