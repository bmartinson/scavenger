import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { IScavengerWaypoint } from '../interface/scavenger-waypoint.interface';
import { ScavengerModel } from './scavenger-model';
import { ScavengerWaypoint } from './scavenger-waypoint';

export class ScavengerHunt extends ScavengerModel implements IScavengerHunt {

  private _name: string;
  private _type: ScavengerHuntType;
  private _startingWaypoint: ScavengerWaypoint;
  private _idCurrentWaypoint: string;
  private _waypointCount: number;
  private _validWaypointCount: number;
  public capturedWaypointCount: number;

  /* * * * * Property Access * * * * */

  public get name(): string {
    return this._name;
  }

  public get type(): ScavengerHuntType {
    return this._type;
  }

  public get startingWaypoint(): ScavengerWaypoint {
    return this._startingWaypoint;
  }

  public get idCurrentWaypoint(): string {
    return this._idCurrentWaypoint;
  }

  public get currentWaypoint(): ScavengerWaypoint | undefined {
    return undefined;
  }

  public get waypointCount(): number {
    return this._waypointCount;
  }

  public get validWaypointCount(): number {
    return this._validWaypointCount;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerHunt) {
    super(data);

    this._name = data?.name;
    this._type = data?.type;
    this._startingWaypoint = !!data?.startingWaypoint ? new ScavengerWaypoint(data.startingWaypoint) : undefined;

    this.capturedWaypointCount = 0;
    this._waypointCount = this.startingWaypoint ? this.startingWaypoint.countWaypoints() : 0;
    this._waypointCount = this.startingWaypoint ? this.startingWaypoint.countWaypoints(true) : 0;
  }

  public toObject(): IScavengerHunt {
    return Object.assign(super.toObject(), {
      name: this.name,
      type: this.type,
      startingWaypoint: this.startingWaypoint?.toObject(),
      idCurrentWaypoint: this.idCurrentWaypoint,
    });
  }

  public getWaypoint(idWaypoint: string): ScavengerWaypoint | undefined {
    if (!this.startingWaypoint) {
      return undefined;
    }

    return this.startingWaypoint.getWaypoint(idWaypoint);
  }

}
