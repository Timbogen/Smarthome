/**
 * Model for the user administration
 */
export interface AdministrationModel {
    /**
     * Id of the user
     */
    _id: string;
    /**
     * Name of the user
     */
    username: string;
    /**
     * Role of the user
     */
    role: string;
}
