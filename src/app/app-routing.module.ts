import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { HuntsComponent } from './components/hunts/hunts.component';
import { NoWaypointComponent } from './components/no-waypoint/no-waypoint.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SupportComponent } from './components/support/support.component';
import { TermsComponent } from './components/terms/terms.component';
import { WaypointComponent } from './components/waypoint/waypoint.component';
import { CanActivateAccountGuard } from './guards/can-activate-account.guard';
import { CanActivateWaypointGuard } from './guards/can-activate-waypoint.guard';
import { CanActivateGuard } from './guards/can-activate.guard';
import { AppPreloadingStrategyService } from './services/app-preloading-strategy.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [CanActivateAccountGuard]
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'terms',
    component: TermsComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: 'account',
    canActivate: [CanActivateAccountGuard],
    canActivateChild: [CanActivateAccountGuard],
    children: [
      {
        path: 'hunts',
        component: HuntsComponent,
      },
      {
        path: 'info',
        component: AccountComponent,
      },
      {
        path: '**',
        redirectTo: 'hunts',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: ':idHunt/:idWaypoint',
    component: WaypointComponent,
    canActivate: [CanActivateWaypointGuard],
    resolve: {
      waypointData: CanActivateWaypointGuard,
    }
  },
  {
    path: 'oops',
    component: NoWaypointComponent,
    canActivate: [CanActivateGuard]
  },
  {
    path: '**',
    redirectTo: 'oops'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: false,
      preloadingStrategy: AppPreloadingStrategyService
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
