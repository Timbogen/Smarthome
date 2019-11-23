/**
 * IDs for the components
 */
export enum SmartComponent {
    /**
     * Constant for no selection
     */
    HOME = 0,
    /**
     * Constant for the camera component
     */
    CAMERA = 1,
    /**
     * Constant for the cellar component
     */
    CELLAR = 2,
    /**
     * Constant for the garage component
     */
    GARAGE = 3
}

/**
 * Model for configuring the shown information
 */
export class ConfigurationInformationModel {
    /**
     * Is the mobile mode on
     */
    public mobile = false;
    /**
     * Is the camera component visible
     */
    public camera = true;
    /**
     * Is the cellar component visible
     */
    public cellar = true;
    /**
     * Is the garage component visible
     */
    public garage = true;
}
