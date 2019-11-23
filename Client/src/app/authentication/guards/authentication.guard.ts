import {CanActivate, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../store/app.state';
import {Injectable} from '@angular/core';
import {selectUser} from '../store/user.selectors';
import {map} from 'rxjs/operators';
import {UserState} from '../store/user.reducer';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    /**
     * Guard that secures routes that should be accessible until the user is logged in
     * @param store of the application
     * @param router to change the route
     */
    constructor(public store: Store<AppState>,
                public router: Router) {
    }

    /**
     * Method that checks whether a user is logged in
     */
    public canActivate(): Observable<boolean> {
        return this.store.pipe(
            select(selectUser),
            map((user: UserState) => {
                if (!user.isAuthenticated) {
                    this.router.navigate(['login']);
                    return false;
                }
                return true;
            })
        );
    }
}
