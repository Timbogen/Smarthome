import {Injectable, OnDestroy} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {AdministrationModel} from '../models/administration.model';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {UserState} from '../../../../authentication/store/user.reducer';
import {selectUser} from '../../../../authentication/store/user.selectors';
import {map, takeUntil} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdministrationService implements OnDestroy {

    /**
     * Route to the server
     */
    public readonly serverRoute = `${environment.serverURL}/api`;
    /**
     * User data
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * Component for user administration
     * @param httpClient for requests
     * @param store of the application
     */
    constructor(public httpClient: HttpClient,
                public store: Store<AppState>) {
        // Get the user data
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
    }

    /**
     * Delete every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Method that returns all users
     */
    public getUsers(): Observable<AdministrationModel[]> {
        return this.httpClient.get(`${this.serverRoute}/users`).pipe(
            map((users: AdministrationModel[]) => users)
        );
    }

    /**
     * Method that returns all users
     */
    public deleteUser(id: string): Observable<any> {
        return this.httpClient.delete(`${this.serverRoute}/deleteUser/${id}`);
    }

    /**
     * Method that returns all users
     */
    public changeRole(user: AdministrationModel): Observable<any> {
        return this.httpClient.put(`${this.serverRoute}/user/role`, user);
    }
}
