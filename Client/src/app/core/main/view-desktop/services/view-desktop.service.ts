import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {ConfigurationState} from '../../../../configuration/store/configuration.reducer';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {selectConfiguration} from '../../../../configuration/store/configuration.selectors';
import {takeUntil} from 'rxjs/operators';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {CameraPositionModel} from '../models/camera-position.model';

@Injectable({
    providedIn: 'root'
})
export class ViewDesktopService implements OnDestroy {

    /**
     * Constant for the maximum process
     */
    public readonly MAX_PROGRESS = 100;
    /**
     * Zooming progress
     */
    public progress = 0;
    /**
     * Configuration state
     */
    public configuration: ConfigurationState;
    /**
     * Camera of the scene
     */
    public camera: THREE.PerspectiveCamera;
    /**
     * For controlling the 3d model
     */
    public controls: OrbitControls;
    /**
     * Home position of the camera
     */
    public homePosition: CameraPositionModel = new CameraPositionModel(0, 0, 0);
    /**
     * For the camera movement
     */
    public delta: CameraPositionModel = new CameraPositionModel(0, 0, 0);
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    constructor(public store: Store<AppState>) {
        // Get the configuration
        store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => this.configuration = configuration);
    }

    /**
     * Delete every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Method to tell whether a thing is activated
     * @param selection that is requested
     */
    isActive(selection: number) {
        return this.configuration.desktop.selectedComponent === selection;
    }

    /**
     * Method that triggers the zooming progress to a specific component
     * @param x of the component
     * @param y of the component
     * @param z of the component
     */
    public zoomIn = (x: number, y: number, z: number): void => {
        // Reset the progress
        this.progress = 0;
        // Calculate the delta steps
        this.delta.x = (x - this.camera.position.x) / this.MAX_PROGRESS;
        this.delta.y = (y - this.camera.position.y) / this.MAX_PROGRESS;
        this.delta.z = (z - this.camera.position.z) / this.MAX_PROGRESS;
        // Start zooming
        this.zoom();
    }

    /**
     * Method to zoom on a given position
     */
    public zoom = (): void => {
        if (this.progress < this.MAX_PROGRESS) {
            window.requestAnimationFrame(this.zoom);
        }
        // Move the camera
        this.camera.position.x += this.delta.x;
        this.camera.position.y += this.delta.y;
        this.camera.position.z += this.delta.z;
        // Update the progress count
        this.progress++;
    }
}
