import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { IScavengerWaypoint } from '../interface/scavenger-waypoint.interface';
import { ScavengerModel } from './scavenger-model';
import { ScavengerWaypoint } from './scavenger-waypoint';

export class ScavengerHunt extends ScavengerModel implements IScavengerHunt {

  private _name: string;
  private _type: ScavengerHuntType;
  private _waypoints: ScavengerWaypoint[];

  /* * * * * Property Access * * * * */

  public get name(): string {
    return this._name;
  }

  public get type(): ScavengerHuntType {
    return this._type;
  }

  public get waypoints(): Array<ScavengerWaypoint> {
    return this._waypoints;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerHunt) {
    super(data);

    this._name = data?.name;
    this._type = data?.type;
    this._waypoints = [];

    // initialize all of the waypoints
    if (data?.waypoints?.length > 0) {
      for (const waypoint of data.waypoints) {
        this._waypoints.push(new ScavengerWaypoint(waypoint));
      }
    }
  }

  public toObject(): IScavengerHunt {
    const serializedWaypoints: IScavengerWaypoint[] = [];

    // if we have a valid list of waypoints, serialize each one
    if (this.waypoints.length > 0) {
      for (const waypoint of this.waypoints) {
        serializedWaypoints.push(waypoint.toObject());
      }
    }

    return Object.assign(super.toObject(), {
      name: this.name,
      type: this.type,
      waypoints: serializedWaypoints,
    });
  }

}
