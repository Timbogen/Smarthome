import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserState} from '../store/user.reducer';
import {HttpClient} from '@angular/common/http';
import {CredentialsModel} from '../models/credentials.model';
import {map, takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {selectUser} from '../store/user.selectors';
import {ChangeUserModel} from '../models/change-user.model';
import {environment} from '../../../environments/environment';

/**
 * Administrator has every permission
 */
export const ADMIN = 'Administrator';
/**
 * Member is able to see the information
 */
export const MEMBER = 'Mitglied';
/**
 * Unknown cant see anything and also cant access the main content
 */
export const UNKNOWN = 'Unbekannter';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {

    /**
     * Route to the server
     */
    public readonly serverRoute = `${environment.serverURL}/api`;
    /**
     * Authentication state of the current user
     */
    public user: UserState;
    /**
     * Subject to unsubscribe anything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Service for user authentication on the server
     * @param httpClient for server communication
     * @param store of the application
     */
    constructor(public httpClient: HttpClient,
                public store: Store<AppState>) {
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
    }

    /**
     * Unsubscribe every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Checks whether the user is an admin
     */
    public isAdmin(): boolean {
        return this.user.role === ADMIN;
    }

    /**
     * Checks whether the user is a known user
     */
    public isKnown(): boolean {
        return this.user.role === MEMBER || this.isAdmin();
    }

    /**
     * Method to authenticate a user at the server
     * @param credentials of the user trying to authentication
     */
    public login(credentials: CredentialsModel): Observable<UserState> {
        // Communicate with the server
        return this.requestAuthentication(credentials, 'login');
    }

    /**
     * Method to register a user at the server
     * @param credentials of the user trying to register
     */
    public register(credentials: CredentialsModel): Observable<UserState> {
        // Communicate with the server
        return this.requestAuthentication(credentials, 'register');
    }

    /**
     * Method for executing authentication requests
     * @param credentials of the user
     * @param route to be called
     */
    public requestAuthentication(credentials: CredentialsModel, route: string): Observable<UserState> {
        return this.httpClient.post(`${this.serverRoute}/${route}`, credentials).pipe(
            map((user: UserState) => {
                user.isAuthenticated = true;
                return user;
            })
        );
    }

    /**
     * Method to update an user
     */
    public update(): Observable<any> {
        return this.httpClient.post(`${this.serverRoute}/update`, this.user);
    }

    /**
     * Method to change a users e-mail
     * @param property email
     */
    public changeEmail(property: ChangeUserModel): Observable<UserState> {
        return this.httpClient.post(`${this.serverRoute}/user/email`, property).pipe(
            map((user: UserState) => user)
        );
    }

    /**
     * Method to change a users name
     * @param property username
     */
    public changeUsername(property: ChangeUserModel): Observable<UserState> {
        return this.httpClient.post(`${this.serverRoute}/user/username`, property).pipe(
            map((user: UserState) => user)
        );
    }

    /**
     * Method to change a users password
     * @param property password
     */
    public changePassword(property: ChangeUserModel): Observable<UserState> {
        return this.httpClient.post(`${this.serverRoute}/user/password`, property).pipe(
            map((user: UserState) => user)
        );
    }
}
