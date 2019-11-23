import * as THREE from 'three';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewDesktopService} from '../services/view-desktop.service';
import {Subject} from 'rxjs';
import {GeometriesModel} from '../models/geometries.model';
import {takeUntil} from 'rxjs/operators';
import {ConfigurationState} from '../../../../configuration/store/configuration.reducer';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {selectConfiguration} from '../../../../configuration/store/configuration.selectors';
import {SmartComponent} from '../../../../configuration/models/configuration-information.model';
import {SetSelectedComponent} from '../../../../configuration/store/configuration.actions';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2';
import {MtlObjBridge} from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';

@Component({
    selector: 'app-home',
    templateUrl: './canvas-home.component.html',
    styleUrls: ['./canvas-home.component.scss']
})
export class CanvasHomeComponent implements OnInit, OnDestroy {

    /**
     * The canvas on which the 3D scene is rendered
     */
    @ViewChild('canvas', {static: true}) canvas: ElementRef;
    /**
     * Height of the header
     */
    public readonly HEADER_HEIGHT = 64;
    /**
     * 3D Scene
     */
    public scene: THREE.Scene;
    /**
     * For 3D rendering
     */
    public renderer: THREE.WebGLRenderer;
    /**
     * For detecting collision
     */
    public rayCaster = new THREE.Raycaster();
    /**
     * The geometries of the scene
     */
    public geometries: GeometriesModel = new GeometriesModel();
    /**
     * Configuration of the client
     */
    public configuration: ConfigurationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    constructor(public desktopService: ViewDesktopService,
                public store: Store<AppState>) {
        // Get the configuration
        store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => this.configuration = configuration);
    }

    public ngOnInit(): void {
        // Execute the initialization
        this.initialization();
        // Load the 3d models
        this.loadModels();
        // Render the scene
        this.render();
    }

    public ngOnDestroy(): void {
        // Unsubscribe all subscriptions
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        // Remove all window events
        window.removeEventListener('resize', this.resizeEvent);
        window.removeEventListener('mousemove', this.mouseEvent);
    }

    /**
     * Method for initial things
     */
    public initialization(): void {
        // Create the scene
        this.scene = new THREE.Scene();

        // Setup the settings-camera
        this.desktopService.camera = new THREE.PerspectiveCamera(this.configuration.desktop.fov,
            this.canvas.nativeElement.width / this.canvas.nativeElement.height, 0.1, 5000);
        this.desktopService.camera.position.set(50, 50, 50);

        // Setup the renderer
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.nativeElement, antialias: true});
        this.renderer.setClearColor('#FFFFFF');
        this.renderer.gammaOutput = true;

        // Setup the orbit controls
        this.desktopService.controls = new OrbitControls(this.desktopService.camera, this.renderer.domElement);
        this.desktopService.controls.target.set(0, 0, 0);
        this.desktopService.controls.maxDistance = 200;
        this.desktopService.controls.rotateSpeed = this.configuration.desktop.rotateSpeed;
        this.desktopService.controls.autoRotate = this.configuration.desktop.present;
        this.desktopService.controls.autoRotateSpeed = this.configuration.desktop.autoRotateSpeed;

        // Resolution setup
        this.resizeEvent();

        // Setup the light
        const light1 = new THREE.PointLight(0xFFFFFF, 2, 200);
        light1.position.set(50, 50, 50);
        this.scene.add(light1);
        const light2 = new THREE.PointLight(0xFFFFFF, 2, 200);
        light2.position.set(-50, 50, -50);
        this.scene.add(light2);

        // Add all the window events
        window.addEventListener('resize', this.resizeEvent);
        window.addEventListener('mousemove', this.mouseEvent);
    }

    /**
     * Method for handling resize events
     */
    public resizeEvent = (): void => {
        this.canvas.nativeElement.width = window.innerWidth;
        this.canvas.nativeElement.height = window.innerHeight - this.HEADER_HEIGHT;
        // Resize the scene
        this.renderer.setSize(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        // Update the aspect ratio
        this.desktopService.camera.aspect = this.canvas.nativeElement.width / this.canvas.nativeElement.height;
        this.desktopService.camera.updateProjectionMatrix();
    }

    /**
     * Method for handling mouse events
     * @param event of the mouse
     */
    public mouseEvent = (event: MouseEvent): void => {
        this.toggleComponent(event, false);
    }

    /**
     * Method to load the 3d models
     */
    public loadModels(): void {
        ///// Load the house parts /////
        const offsetX = 6;
        const offsetZ = 10;
        // The material loader
        const mtlLoader = new MTLLoader();

        // Method to load the house parts
        const housePartLoader = (name: string, y: number): THREE.Group => {
            // The upper floor
            mtlLoader.load(`../../assets/models/${name}.mtl`, (result) => {
                const materials = MtlObjBridge.addMaterialsFromMtlLoader(result);
                const objLoader = new OBJLoader2();
                objLoader.addMaterials(materials);
                objLoader.load(`../../assets/models/${name}.obj`, (object: THREE.Group) => {
                    // Set the standard rotation and the offset
                    object.position.set(offsetX, y, offsetZ);
                    // Add the object
                    this.scene.add(object);
                    // Return the object
                    return object;
                });
            });
            return null;
        };
        // Load the objects
        this.geometries.environment = housePartLoader('Umgebung', 0);
        this.geometries.lowerFloor = housePartLoader('Keller', 0);
        this.geometries.groundFloor = housePartLoader('Erdgeschoss', 2.9);
        this.geometries.upperFloor = housePartLoader('Dachgeschoss', 5.8);

        ///// The dialog-component doors /////
        const garageDoorGeometrical = new THREE.BoxGeometry(0.1, 2.1, 2.5);
        const garageDoorMaterial = new THREE.MeshPhysicalMaterial({color: 0x0F0F0F});
        const garageDoorX = offsetX - 10.08;
        const garageDoorY = 4.25;
        const garageDoorZ = offsetZ - 16.64;
        // Left door
        this.geometries.garageDoorOne = new THREE.Mesh(garageDoorGeometrical, garageDoorMaterial);
        this.geometries.garageDoorOne.position.set(garageDoorX, garageDoorY, garageDoorZ + 2.7);
        this.scene.add(this.geometries.garageDoorOne);
        // Right door
        this.geometries.garageDoorTwo = new THREE.Mesh(garageDoorGeometrical, garageDoorMaterial);
        this.geometries.garageDoorTwo.position.set(garageDoorX, garageDoorY, garageDoorZ);
        this.scene.add(this.geometries.garageDoorTwo);

        ///// The buttons /////
        const buttonGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 30);
        buttonGeometry.rotateX(Math.PI / 2);
        // Button for the settings-camera
        this.geometries.buttonCamera = new THREE.Mesh(buttonGeometry, garageDoorMaterial);
        this.geometries.buttonCamera.position.set(1, 12, 11);
        this.scene.add(this.geometries.buttonCamera);
        // Button for the dialog-cellar
        this.geometries.buttonCellar = new THREE.Mesh(buttonGeometry, garageDoorMaterial);
        this.geometries.buttonCellar.position.set(7, 12, 2.7);
        this.scene.add(this.geometries.buttonCellar);
        // Button for the dialog-component
        this.geometries.buttonGarage = new THREE.Mesh(buttonGeometry, garageDoorMaterial);
        this.geometries.buttonGarage.position.set(garageDoorX, 12, -5);
        this.scene.add(this.geometries.buttonGarage);
    }

    /**
     * Method to render the scene
     */
    public render = (): void => {
        // Start an animation
        requestAnimationFrame(this.render);

        // Rotate the buttons
        this.geometries.buttonCamera.rotation.y += 0.01;
        this.geometries.buttonCellar.rotation.y += 0.01;
        this.geometries.buttonGarage.rotation.y += 0.01;

        // Update the orbit controls
        this.desktopService.controls.update();

        // Render the scene
        this.renderer.render(this.scene, this.desktopService.camera);
    }

    /**
     * Method for the animation of the buttons
     */
    public toggleComponent(event: MouseEvent, click: boolean): void {
        // Update the rayCasters direction
        const mouse = new THREE.Vector2();
        mouse.x = (event.pageX / this.canvas.nativeElement.width) * 2 - 1;
        mouse.y = -((event.pageY - this.HEADER_HEIGHT) / this.canvas.nativeElement.height) * 2 + 1;
        this.rayCaster.setFromCamera(mouse, this.desktopService.camera);

        // Method for checking the button intersections
        const checkIntersection = (object: THREE.Mesh, component: SmartComponent): boolean => {
            // Look for intersection on the settings-camera button
            const intersects = this.rayCaster.intersectObject(object);
            // Check if there was a intersection
            if (intersects.length <= 0) {
                document.body.style.cursor = 'default';
                return false;
            }
            document.body.style.cursor = 'pointer';
            // Check if the button is clicked
            if (click) {
                this.store.dispatch(SetSelectedComponent({component}));
                return true;
            }
            return true;
        };

        // Check the intersections
        if (checkIntersection(this.geometries.buttonCamera, SmartComponent.CAMERA)) {
            return;
        }
        if (checkIntersection(this.geometries.buttonCellar, SmartComponent.CELLAR)) {
            return;
        }
        checkIntersection(this.geometries.buttonGarage, SmartComponent.GARAGE);
    }

    /**
     * Method to close a dialog-component door
     * @param mesh the dialog-component door to be closed
     */
    public closeGarage = (mesh: THREE.Mesh): void => {
        // Rotation and moving to make it look like a dialog-component door opening
        mesh.rotation.y -= Math.PI / 600;
        mesh.position.z -= 1.8 / 600;
        mesh.position.x -= 2.5 / 600;

        // Only callback if opening isnt completed
        if (mesh.rotation.y > 0) {
            requestAnimationFrame(() => {
                this.closeGarage(mesh);
            });
        }
    }

    /**
     * Method to open a dialog-component door
     * @param mesh the dialog-component door to be opened
     */
    public openGarage = (mesh: THREE.Mesh): void => {
        // Rotation and moving to make it look like a dialog-component door opening
        mesh.rotation.y += Math.PI / 600;
        mesh.position.z += 1.8 / 600;
        mesh.position.x += 2.5 / 600;

        // Only callback if opening isnt completed
        if (mesh.rotation.y < Math.PI / 2) {
            requestAnimationFrame(() => {
                this.openGarage(mesh);
            });
        }
    }
}
