import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { ScavengerModel } from './scavenger-model';
import { ScavengerWaypoint } from './scavenger-waypoint';

export class ScavengerHunt extends ScavengerModel implements IScavengerHunt {

  private _name: string;
  private _type: ScavengerHuntType;
  private _startingWaypoint: ScavengerWaypoint;
  private _waypointCount: number;
  private _validWaypointCount: number;
  private _singlePathOnly: boolean;
  public idCurrentWaypoint: string;

  /* * * * * Property Access * * * * */

  public get name(): string {
    return this._name;
  }

  public get type(): ScavengerHuntType {
    return this._type;
  }

  public get singlePathOnly(): boolean {
    return this._singlePathOnly;
  }

  public get startingWaypoint(): ScavengerWaypoint {
    return this._startingWaypoint;
  }

  public get currentWaypoint(): ScavengerWaypoint | undefined {
    if (!this.idCurrentWaypoint) {
      return undefined;
    }

    return this.getWaypoint(this.idCurrentWaypoint);
  }

  public get waypointCount(): number {
    return this._waypointCount;
  }

  public get validWaypointCount(): number {
    return this._validWaypointCount;
  }

  public get capturedWaypointCount(): number {
    return this.startingWaypoint.countWaypoints(false, true);
  }

  public get capturedValidWaypointCount(): number {
    return this.startingWaypoint.countWaypoints(true, true);
  }

  public get capturedWaypoints(): ScavengerWaypoint[] {
    const waypoints: ScavengerWaypoint[] = [];
    this.startingWaypoint.countWaypoints(true, true, waypoints);

    return waypoints;
  }

  public isFinished(): boolean {
    return this.capturedWaypointCount === this.validWaypointCount;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerHunt) {
    super(data);

    this._name = data?.name;
    this._type = data?.type;
    this._startingWaypoint = !!data?.startingWaypoint ? new ScavengerWaypoint(data.startingWaypoint) : undefined;

    this._waypointCount = this.startingWaypoint ? this.startingWaypoint.countWaypoints() : 0;
    this._validWaypointCount = this.startingWaypoint ? this.startingWaypoint.countWaypoints(true) : 0;
    this.idCurrentWaypoint = data?.idCurrentWaypoint;
    this._singlePathOnly = !!data?.singlePathOnly;
  }

  public toObject(): IScavengerHunt {
    return Object.assign(super.toObject(), {
      name: this.name,
      type: this.type,
      startingWaypoint: this.startingWaypoint?.toObject(),
      idCurrentWaypoint: this.idCurrentWaypoint,
      singlePathOnly: this.singlePathOnly,
    });
  }

  public getWaypoint(idWaypoint: string): ScavengerWaypoint | undefined {
    if (!this.startingWaypoint) {
      return undefined;
    }

    return this.startingWaypoint.getWaypoint(idWaypoint);
  }

}
