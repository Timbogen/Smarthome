/**
 * Model for configuring the desktop view
 */
import {FastNavigationModel} from '../../core/main/view-desktop/models/fast-navigation.model';
import {SmartComponent} from './configuration-information.model';

export class ConfigurationDesktopModel {
    /**
     * Selected component
     */
    public selectedComponent: SmartComponent = SmartComponent.HOME;
    /**
     * Is the present mode on
     */
    public present = true;
    /**
     * Field of view
     */
    public fov = 60;
    /**
     * Speed of the camera when moving
     */
    public rotateSpeed = 0.002;
    /**
     * Speed of the camera on present mode
     */
    public autoRotateSpeed = 2;
    /**
     * Information for the fast navigation dialog
     */
    public navigation: FastNavigationModel = new FastNavigationModel();
}
