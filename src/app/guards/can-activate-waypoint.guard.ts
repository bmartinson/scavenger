import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NoWaypointComponent } from '../components/no-waypoint/no-waypoint.component';
import { WaypointComponent } from '../components/waypoint/waypoint.component';
import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { ScavengerHuntRouteData } from '../model/scavenger-hunt-route-data';
import { ScavengerWaypoint } from '../model/scavenger-waypoint';
import { AppService } from '../services/app.service';
import { CanActivateGuard } from './can-activate.guard';

@Injectable({
  providedIn: 'root'
})
export class CanActivateWaypointGuard extends CanActivateGuard implements
  CanActivate,
  CanActivateChild,
  CanLoad,
  Resolve<ScavengerHuntRouteData>
{

  private waypointStatus: ScavengerWaypointStatus;
  private waypoint: ScavengerWaypoint;

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

    this.waypoint = this.appService.getWaypoint(next.paramMap.get('idWaypoint'));

    const discoveries: ScavengerWaypoint[] = this.appService.discoveries;
    this.appService.showJournal = next.component === WaypointComponent || next.component === NoWaypointComponent;

    // show the journal when there are any discoveries only when we are on an out of order or duplicate discovery
    if (this.waypointStatus === ScavengerWaypointStatus.OUT_OF_ORDER || this.waypointStatus === ScavengerWaypointStatus.DUPLICATE) {
      this.appService.showJournal = this.appService.showJournal && discoveries.length > 0;
    } else {
      this.appService.showJournal = this.appService.showJournal && discoveries.length > 1;
    }

    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.INVALID:
      case ScavengerWaypointStatus.START:
      case ScavengerWaypointStatus.FINISH:
      case ScavengerWaypointStatus.OUT_OF_ORDER:
      case ScavengerWaypointStatus.DUPLICATE:
      case ScavengerWaypointStatus.VALID:
      case ScavengerWaypointStatus.WRONG_HUNT:
        return true;

      default:
        this.router.navigate(['oops'], { replaceUrl: true });
        return false;
    }
  }

  public resolve(): ScavengerHuntRouteData {
    return new ScavengerHuntRouteData(this.waypoint, this.waypointStatus, this.appService.huntType);
  }

}
