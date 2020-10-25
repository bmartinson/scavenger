import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { IScavengerModel } from './scavenger-model.interface';

export interface IScavengerHunt extends IScavengerModel {
  name: string;
  type: ScavengerHuntType;
  waypoints: Array<IScavengerWaypoint[]>; // waypoints[stage][waypoint]
}
