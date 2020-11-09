import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { AppService } from '../services/app.service';
import { CanActivateGuard } from './can-activate.guard';

@Injectable({
  providedIn: 'root'
})
export class CanActivateWaypointGuard extends CanActivateGuard implements
  CanActivate,
  CanActivateChild,
  CanLoad,
  Resolve<ScavengerWaypointStatus>
{

  private waypointStatus: ScavengerWaypointStatus;

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

    this.waypointStatus = await this.appService.scanWaypoint(
      next.paramMap.get('idHunt'),
      next.paramMap.get('idWaypoint')
    );

    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.START:
      case ScavengerWaypointStatus.FINISH:
      case ScavengerWaypointStatus.OUT_OF_ORDER:
      case ScavengerWaypointStatus.VALID:
        return true;

      default:
        this.router.navigate(['oops'], { replaceUrl: true });
        return false;
    }
  }

  public resolve(): ScavengerWaypointStatus {
    return this.waypointStatus;
  }

}
