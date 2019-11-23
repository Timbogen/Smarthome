/**
 * Model for changing a property of an user
 */
export interface ChangeUserModel {
    /**
     * id of the user
     */
    _id: string;
    /**
     * Old value of the property
     */
    oldValue: string;
    /**
     * New value of the property
     */
    newValue: string;
}
