import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { IScavengerModel } from './scavenger-model.interface';
import { IScavengerWaypoint } from './scavenger-waypoint.interface';

export interface IScavengerHunt extends IScavengerModel {
  name: string;
  type: ScavengerHuntType;
  waypoints: Array<IScavengerWaypoint>; // waypoints[stage][waypoint]
}
