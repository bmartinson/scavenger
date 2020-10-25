import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum.ts';

export interface IScavengerHunt {
  id: string;
  name: string;
  type: ScavengerHuntType;
  waypoints: IScavengerWaypoint[];
}
