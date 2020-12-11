import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NoWaypointComponent } from '../components/no-waypoint/no-waypoint.component';
import { WaypointComponent } from '../components/waypoint/waypoint.component';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(protected router: Router, protected appService: AppService) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {

    // manage the display of the navigation bar
    this.appService.showJournal = false;
    this.appService.showNavigation = next.component !== WaypointComponent &&
      next.component !== NoWaypointComponent;

    return Promise.resolve(true);
  }

  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  public canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
