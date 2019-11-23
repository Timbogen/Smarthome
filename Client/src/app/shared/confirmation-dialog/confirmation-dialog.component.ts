import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmationDialogModel} from './models/confirmation-dialog.model';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

    /**
     * Dialog for confirming actions like user deletions
     * @param dialogRef reference of the dialog
     * @param data passed on dialog open call
     */
    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogModel) {
    }

    /**
     * Close the dialog
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Execute the callback action
     */
    public confirmAction(): void {
        this.data.callback();
    }
}
