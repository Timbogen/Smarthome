import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {UserState} from './store/user.reducer';
import {selectUser} from './store/user.selectors';
import {takeUntil} from 'rxjs/operators';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor, OnDestroy {

    /**
     * State of the user
     */
    public user: UserState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * The interceptor automatically adds the token to certain requests
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        store.pipe(select(selectUser), takeUntil(this.unsubscribe$)).subscribe((user: UserState) => (this.user = user));
    }

    /**
     * Deletes every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Adds the authorization token on certain requests
     * @param req to be modified
     * @param next http handler
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.user.isAuthenticated) {
            // Add the bearer token
            return next.handle(
                req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.user.token}`
                    }
                })
            );
        }
        return next.handle(req);
    }
}
