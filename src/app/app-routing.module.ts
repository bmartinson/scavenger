import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HostComponent } from './components/host/host.component';
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
    canActivate: [CanActivateGuard]
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
    path: 'host',
    component: HostComponent,
    canActivate: [CanActivateAccountGuard],
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
