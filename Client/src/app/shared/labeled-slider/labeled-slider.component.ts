import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'labeled-slider',
    templateUrl: './labeled-slider.component.html',
    styleUrls: ['./labeled-slider.component.scss']
})
export class LabeledSliderComponent {

    /**
     * Minimum value of the slider
     */
    @Input()
    public leftLabel: string;
    /**
     * Minimum value of the slider
     */
    @Input()
    public rightLabel: string;
    /**
     * Minimum value of the slider
     */
    @Input()
    public min: number;
    /**
     * Maximum value of the slider
     */
    @Input()
    public max: number;
    /**
     * Step solution
     */
    @Input()
    public step: number;
    /**
     * Value of the slider
     */
    @Input()
    public value: number;
    /**
     * Value of the slider
     */
    @Output()
    public change: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Method that is triggered when the slider value was changed
     */
    public changeValue(): void {
        this.change.emit(this.value);
    }
}
