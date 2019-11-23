import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {MemberGuard} from './authentication/guards/member.guard';
import {AuthenticationGuard} from './authentication/guards/authentication.guard';
import {UnknownUserComponent} from './core/unknown-user/unknown-user.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {UnknownGuard} from './authentication/guards/unknown.guard';
import {MainComponent} from './core/main/main.component';
import {UserComponent} from './core/user/user.component';


const appRoutes: Routes = [
    {
        path: 'login',
        component: AuthenticationComponent
    },
    {
        path: 'unknown',
        component: UnknownUserComponent,
        canActivate: [AuthenticationGuard, UnknownGuard]
    },
    {
        path: 'home',
        component: MainComponent,
        canActivate: [AuthenticationGuard, MemberGuard]
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthenticationGuard, MemberGuard]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        ),
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
