import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { ScavengerWaypoint } from './scavenger-waypoint';

export class ScavengerHuntRouteData {

  public waypoint: ScavengerWaypoint;
  public waypointStatus: ScavengerWaypointStatus;

  constructor(waypoint: ScavengerWaypoint, status: ScavengerWaypointStatus) {
    this.waypoint = waypoint;
    this.waypointStatus = status;
  }

}
