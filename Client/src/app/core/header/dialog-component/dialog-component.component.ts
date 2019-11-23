import {Component, HostListener} from '@angular/core';
import {ViewDesktopService} from '../../main/view-desktop/services/view-desktop.service';
import {SmartComponent} from '../../../configuration/models/configuration-information.model';

@Component({
    selector: 'app-garage',
    templateUrl: './dialog-component.component.html',
    styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponentComponent {

    constructor(public mainData: ViewDesktopService) {
    }

    /**
     * Disable all mouse move events when the dialog is open
     * @param event that happens
     */
    @HostListener('mousedown', ['$event'])
    public onClick(event: any): void {
        event.stopPropagation();
    }

    /**
     * Method returns true if camera component is selected
     */
    isCameraActive() {

        return this.mainData.isActive(SmartComponent.CAMERA);
    }

    /**
     * Method returns true if cellar component is selected
     */
    isCellarActive() {

        return this.mainData.isActive(SmartComponent.CELLAR);
    }

    /**
     * Method returns true if garage component is selected
     */
    isGarageActive() {

        return this.mainData.isActive(SmartComponent.GARAGE);
    }
}
