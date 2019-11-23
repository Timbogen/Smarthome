/**
 * Model describing the cameras position
 */
export class CameraPositionModel {
    /**
     * X-Coordinate of the camera
     */
    public x: number;
    /**
     * Y-Coordinate of the camera
     */
    public y: number;
    /**
     * Z-Coordinate of the camera
     */
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
