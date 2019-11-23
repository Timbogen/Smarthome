import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AppState} from '../../store/app.state';
import {select, Store} from '@ngrx/store';
import {selectUser} from '../store/user.selectors';
import {map} from 'rxjs/operators';
import {UserState} from '../store/user.reducer';
import {ADMIN, MEMBER} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberGuard implements CanActivate {

    /**
     * Guard that secures routes that should not be accessible for a unknown user
     * @param store of the application
     * @param router to change the route
     */
    constructor(public store: Store<AppState>,
                public router: Router) {}

    /**
     * Checks whether the user is unknown
     */
    public canActivate(): Observable<boolean> {
        return this.store.pipe(
            select(selectUser),
            map((user: UserState) => {
                if (user.role !== MEMBER && user.role !== ADMIN) {
                    this.router.navigate(['unknown']);
                    return false;
                }
                return true;
            })
        );
    }
}
