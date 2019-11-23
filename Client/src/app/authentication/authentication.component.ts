import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {Login, Register} from './store/user.actions';
import {CredentialsModel} from './models/credentials.model';
import {ConfigurationHeaderModel} from '../configuration/models/configuration-header.model';
import {SetHeaderConfiguration} from '../configuration/store/configuration.actions';
import {environment} from '../../environments/environment';
import {selectUser} from './store/user.selectors';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {SnackBarService} from '../shared/snack-bar/snack-bar.service';

@Component({
    selector: 'app-content-login',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnDestroy {

    /**
     * Header configuration for this component
     */
    public readonly headerConfiguration: ConfigurationHeaderModel = {
        backHome: false,
        backMain: false,
        edit: false,
        information: false,
        logo: true,
        present: false,
        title: true,
        user: false,
        userEdit: false
    };
    /**
     * Is the application loading?
     */
    public loading = false;
    /**
     * Minimal length of a password
     */
    public minPWLength = environment.minPWLength;
    /**
     * Login form control
     */
    public loginForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });
    /**
     * Register form control
     */
    public registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(this.minPWLength)]),
        passwordRepeat: new FormControl('', Validators.required)
    });
    /**
     * Subject to unsubscribe everything
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component for registering or logging in users
     * @param store of the application
     * @param snackBarService for notifications
     */
    constructor(public store: Store<AppState>,
                public snackBarService: SnackBarService) {
        // Configure the header
        store.dispatch(SetHeaderConfiguration({headerConfiguration: this.headerConfiguration}));
        // Listen for state changes
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe(() => this.loading = false);
    }

    /**
     * Delete every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Method to start the authentication action by passing the credentials
     * @param values of the user
     */
    public login(values): void {
        // Show the loading spinner
        this.loading = true;
        // authentication credentials
        const credentials: CredentialsModel = {
            email: values.email,
            username: '',
            password: values.password
        };
        // Start the authentication action
        this.store.dispatch(Login({credentials}));
    }

    /**
     * Method to start the register action by passing the credentials
     * @param values of the user
     */
    public register(values): void {
        // Show the loading spinner
        this.loading = true;
        // Check if the username contains an @
        if (values.username.includes('@')) {
            this.snackBarService.error('Benutzername darf kein @ beeinhalten!');
            // Hide the loading spinner
            this.loading = false;
            return;
        }
        // Check if the passwords are the same
        if (values.password !== values.passwordRepeat) {
            this.snackBarService.error('Passwörter sind unterschiedlich!');
            // Hide the loading spinner
            this.loading = false;
            return;
        }
        // register credentials
        const credentials: CredentialsModel = {
            email: values.email,
            username: values.username,
            password: values.password
        };
        // Start the register action
        this.store.dispatch(Register({credentials}));
    }
}
