import {Component, OnDestroy} from '@angular/core';
import {ConfigurationState} from '../../configuration/store/configuration.reducer';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {selectConfiguration} from '../../configuration/store/configuration.selectors';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-content-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy {
    /**
     * Client configuration
     */
    public configuration: ConfigurationState;
    /**
     * Subject to unsubscribe everything on destroy
     */
    public unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * The main component
     * @param store of the application
     */
    constructor(public store: Store<AppState>) {
        // Get the configuration
        store.pipe(select(selectConfiguration), takeUntil(this.unsubscribe$))
            .subscribe((configuration: ConfigurationState) => this.configuration = configuration);
    }

    /**
     * Remove every subscription on destroy
     */
    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
