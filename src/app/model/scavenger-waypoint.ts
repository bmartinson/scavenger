import { IScavengerWaypoint } from '../interface/scavenger-waypoint.interface';
import { ScavengerModel } from './scavenger-model';

export class ScavengerWaypoint extends ScavengerModel implements IScavengerWaypoint {

  private _name: string;
  private _value: number;
  private _valid: boolean;
  private _dialog: string[];
  private _outOfOrderDialog: string[];
  private _waypoints: ScavengerWaypoint[];

  /* * * * * Property Access * * * * */

  public get name(): string {
    return this._name;
  }

  public get value(): number {
    return this._value;
  }

  public get valid(): boolean {
    return this._valid;
  }

  public get waypoints(): ScavengerWaypoint[] {
    return this._waypoints;
  }

  public get dialog(): string[] {
    if (!this._dialog) {
      this._dialog = ['You did it!'];
    }

    return this._dialog;
  }

  public get outOfOrderDialog(): string[] {
    if (!this._outOfOrderDialog) {
      this._outOfOrderDialog = ['Better back track! You missed a waypoint!'];
    }

    return this._outOfOrderDialog;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerWaypoint) {
    super(data);

    this._name = data?.name;
    this._value = data?.value;
    this._valid = data?.valid;
    this._dialog = data?.dialog;
    this._outOfOrderDialog = data?.outOfOrderDialog;
  }

  public toObject(): IScavengerWaypoint {
    const serializedWaypoints: IScavengerWaypoint[] = [];

    // if we have a valid list of waypoints, serialize each one
    if (this.waypoints.length > 0) {
      for (const waypoint of this.waypoints) {
        serializedWaypoints.push(waypoint.toObject());
      }
    }

    return Object.assign(super.toObject(), {
      name: this.name,
      value: this.value,
      valid: this.valid,
      dialog: this.dialog,
      outOfOrderDialog: this.outOfOrderDialog,
      waypoints: serializedWaypoints,
    });
  }

}
