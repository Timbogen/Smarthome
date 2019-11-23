import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    /**
     * Default duration of a snackbar message
     */
    public readonly DEFAULT_DURATION: number = 3000;

    /**
     * Service for displaying information
     * @param snackBar to display snack bars
     */
    public constructor(public snackBar: MatSnackBar) {
    }

    /**
     * Method to display information on a successful action
     * @param message to be displayed
     * @param duration of the message
     */
    public success(message: string, duration: number = this.DEFAULT_DURATION) {
        this.snackBar.open(message, '', {
            panelClass: 'snack-success',
            duration
        });
    }

    /**
     * Method to display information on a failed action
     * @param message to be displayed
     * @param duration of the message
     */
    public error(message: string, duration: number = this.DEFAULT_DURATION) {
        this.snackBar.open(message, '', {
            panelClass: 'snack-error',
            duration
        });
    }
}
