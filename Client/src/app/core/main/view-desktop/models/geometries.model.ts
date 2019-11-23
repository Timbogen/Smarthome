import * as THREE from 'three';

/**
 * Component containing all the 3D Object of the scene
 */
export class GeometriesModel {
    /**
     * The environment of the house
     */
    public environment: THREE.Group;
    /**
     * The lower floor of the house
     */
    public lowerFloor: THREE.Group;
    /**
     * The ground floor of the house
     */
    public groundFloor: THREE.Group;
    /**
     * The upper floor of the house
     */
    public upperFloor: THREE.Group;
    /**
     * The button for the camera
     */
    public buttonCamera: THREE.Mesh;
    /**
     * The button for the cellar
     */
    public buttonCellar: THREE.Mesh;
    /**
     * The button for the garage
     */
    public buttonGarage: THREE.Mesh;
    /**
     * The left garage door
     */
    public garageDoorOne: THREE.Mesh;
    /**
     * The right garage door
     */
    public garageDoorTwo: THREE.Mesh;
}
