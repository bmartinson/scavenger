import { IScavengerModel } from '../interface/scavenger-model.interface';

export abstract class ScavengerModel implements IScavengerModel {

  private _id: string;

  /* * * * * Property Access * * * * */

  /**
   * The core id for this data model.
   */
  public get id(): string {
    if (!this._id) {
      const now: Date = new Date();
      const seed: number = Math.floor(Math.random() * 10001);

      this._id = `${seed}-${now.getUTCHours()}-${now.getUTCMinutes()}-${now.getUTCSeconds()}-${now.getUTCMilliseconds()}`;
    }

    return this._id;
  }

  /* * * * * Core Implementation * * * * */

  constructor(data?: IScavengerModel) {
    this._id = data?.id;
  }

  /**
   * Get a serialized object representation of this object's data.
   */
  public toObject(): IScavengerModel {
    return {
      id: this.id,
    };
  }
