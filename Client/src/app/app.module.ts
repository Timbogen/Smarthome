import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ViewDesktopComponent} from './core/main/view-desktop/view-desktop.component';
import {HeaderComponent} from './core/header/header.component';
import {
    MatButtonModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {SettingsComponent} from './core/header/settings/settings.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CanvasHomeComponent} from './core/main/view-desktop/canvas-home/canvas-home.component';
import {DialogComponentComponent} from './core/header/dialog-component/dialog-component.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {MainComponent} from './core/main/main.component';
import {ViewMobileComponent} from './core/main/view-mobile/view-mobile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {appReducers, metaReducers} from './store/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {UserEffects} from './authentication/store/user.effects';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {UnknownUserComponent} from './core/unknown-user/unknown-user.component';
import {AppRoutingModule} from './app-routing.module';
import {UserComponent} from './core/user/user.component';
import {UserAdministrationComponent} from './core/user/user-administration/user-administration.component';
import {UserAccountComponent} from './core/user/user-account/user-account.component';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ConfigurationEffects} from './configuration/store/configuration.effects';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {AuthenticationInterceptor} from './authentication/authentication.interceptor';
import {AdministrationEffects} from './core/user/user-administration/store/administration.effects';
import {MatSelectModule} from '@angular/material/select';
import {ConfirmationDialogComponent} from './shared/confirmation-dialog/confirmation-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {LabeledSliderComponent} from './shared/labeled-slider/labeled-slider.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DragDropModule} from '@angular/cdk/drag-drop';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AppComponent,
        ViewDesktopComponent,
        HeaderComponent,
        SettingsComponent,
        CanvasHomeComponent,
        DialogComponentComponent,
        AuthenticationComponent,
        PageNotFoundComponent,
        MainComponent,
        ViewMobileComponent,
        UnknownUserComponent,
        UserComponent,
        UserAdministrationComponent,
        UserAccountComponent,
        ConfirmationDialogComponent,
        LabeledSliderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatToolbarModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatMenuModule,
        MatTableModule,
        MatCardModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSelectModule,
        MatInputModule,
        DeviceDetectorModule.forRoot(),
        HttpClientModule,
        MatSnackBarModule,
        StoreModule.forRoot(
            appReducers,
            {metaReducers}
        ),
        EffectsModule.forRoot([AdministrationEffects, ConfigurationEffects, UserEffects]),
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        AppRoutingModule,
    ],
    entryComponents: [
        DialogComponentComponent,
        SettingsComponent,
        ConfirmationDialogComponent,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
