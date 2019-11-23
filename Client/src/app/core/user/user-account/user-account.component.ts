import {Component} from '@angular/core';
import {UserState} from '../../../authentication/store/user.reducer';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {Subject} from 'rxjs';
import {selectUser} from '../../../authentication/store/user.selectors';
import {takeUntil} from 'rxjs/operators';
import {ChangeEmail, ChangePassword, ChangeUsername} from '../../../authentication/store/user.actions';
import {ChangeUserModel} from '../../../authentication/models/change-user.model';
import {environment} from '../../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SnackBarService} from '../../../shared/snack-bar/snack-bar.service';

@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent {

    /**
     * Minimal length of a password
     */
    public minPWLength = environment.minPWLength;
    /**
     * Email form control
     */
    public emailForm = new FormGroup({
        oldValue: new FormControl('', Validators.required),
        newValue: new FormControl('', [Validators.required, Validators.email])
    });
    /**
     * Username form control
     */
    public usernameForm = new FormGroup({
        oldValue: new FormControl('', Validators.required),
        newValue: new FormControl('', Validators.required)
    });
    /**
     * Password form control
     */
    public passwordForm = new FormGroup({
        oldValue: new FormControl('', Validators.required),
        newValue: new FormControl('', [Validators.required, Validators.minLength(this.minPWLength)]),
        submit: new FormControl('', Validators.required)
    });
    /**
     * The user information
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component that lets the user change his account information
     * @param store of the application
     * @param snackBarService to display information
     */
    constructor(public store: Store<AppState>,
                public snackBarService: SnackBarService) {
        // Get the user information
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
    }

    /**
     * Method to change the email of an user
     */
    public changeEmail(formDirective): void {
        // Create the model
        const email: ChangeUserModel = {
            _id: this.user._id,
            oldValue: this.emailForm.value.oldValue,
            newValue: this.emailForm.value.newValue
        };
        // Check if old email is valid
        if (email.oldValue !== this.user.email) {
            this.snackBarService.error('Die alte E-Mail wurde nicht richtig angegeben!');
            return;
        }
        // Empty the form control
        formDirective.resetForm();
        this.emailForm.reset();
        // Start the change email action
        this.store.dispatch(ChangeEmail({property: email}));
    }

    /**
     * Method to change the name of an user
     */
    public changeUsername(formDirective): void {
        // Create the model
        const username: ChangeUserModel = {
            _id: this.user._id,
            oldValue: this.usernameForm.value.oldValue,
            newValue: this.usernameForm.value.newValue
        };
        // Check if old username is valid
        if (username.oldValue !== this.user.username) {
            this.snackBarService.error('Der alte Name wurde nicht richtig angegeben!');
            return;
        }
        // Check if the username contains an @
        if (username.newValue.includes('@')) {
            this.snackBarService.error('Benutzername darf kein @ beeinhalten!');
            return;
        }
        // Empty the form control
        formDirective.resetForm();
        this.usernameForm.reset();
        // Start the change email action
        this.store.dispatch(ChangeUsername({property: username}));
    }

    /**
     * Method to change the password of an user
     */
    public changePassword(formDirective): void {
        // Create the model
        const password: ChangeUserModel = {
            _id: this.user._id,
            oldValue: this.passwordForm.value.oldValue,
            newValue: this.passwordForm.value.newValue
        };
        // Check if password was typed in correctly twice
        if (password.newValue !== this.passwordForm.value.submit) {
            this.snackBarService.error('Das neue Passwort unterschiedlich eingegeben!');
            return;
        }
        // Empty the form control
        formDirective.resetForm();
        this.passwordForm.reset();
        // Start the change password action
        this.store.dispatch(ChangePassword({property: password}));
    }
}
