/**
 * Data model for a confirmation dialog
 */
export interface ConfirmationDialogModel {
    /**
     * Action to be executed if user typed yes
     */
    callback: () => any;
    /**
     * Text of the cancel button
     */
    cancel: string;
    /**
     * Text of the submit button
     */
    submit: string;
    /**
     * Header to be shown on the dialog
     */
    header: string;
    /**
     * Description to be shown on the dialog
     */
    description: string;
}
