import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NoWaypointComponent } from './components/no-waypoint/no-waypoint.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WaypointComponent } from './components/waypoint/waypoint.component';
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
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [CanActivateGuard]
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
