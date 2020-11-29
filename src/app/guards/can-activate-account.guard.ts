import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import { ScavengerHuntRouteData } from '../model/scavenger-hunt-route-data';
import { AppService } from '../services/app.service';
import { CanActivateGuard } from './can-activate.guard';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAccountGuard extends CanActivateGuard implements
  CanActivate,
  CanActivateChild,
  CanLoad,
  Resolve<ScavengerHuntRouteData>
{

  constructor(protected router: Router, protected appService: AppService) {
    super(router, appService);
  }

  public async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {

    const status = await super.canActivate(next, state);

    if (!status) {
      return status;
    }

    const isLoggedIn: boolean = this.appService.isLoggedIn;

    // if we are routing to the sign in component, we must route to account if we are logged in
    if (next.component === SignInComponent) {
      if (isLoggedIn) {
        return this.router.navigate(['/', 'account']);
      }

      return true;
    }

    // if we aren't signed in, then route to sign in
    if (!isLoggedIn) {
      return this.router.navigate(['/', 'sign-in']);
    }

    return isLoggedIn;
  }

  public resolve(): any {
    return null;
  }

}
