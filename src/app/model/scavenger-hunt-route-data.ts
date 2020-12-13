import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { ScavengerWaypoint } from './scavenger-waypoint';

export class ScavengerHuntRouteData {

  public waypoint: ScavengerWaypoint;
  public waypointStatus: ScavengerWaypointStatus;
  public huntType: ScavengerHuntType;

  constructor(waypoint: ScavengerWaypoint, status: ScavengerWaypointStatus, huntType: ScavengerHuntType) {
    this.waypoint = waypoint;
    this.waypointStatus = status;
    this.huntType = huntType;
  }

}
