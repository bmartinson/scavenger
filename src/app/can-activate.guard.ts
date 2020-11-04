import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './services/app.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(protected router: Router, private appService: AppService) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // manage the display of the navigation bar
    this.appService.showNavigation = next.url.length === 0 || next.url.length > 0 && next.url[0].path.indexOf('no-clue') === -1;

    return true;
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
