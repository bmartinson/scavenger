import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { IScavengerSession } from '../interface/scavenger-session.interface';
import { ScavengerHunt } from './scavenger-hunt';
import { ScavengerModel } from './scavenger-model';

export class ScavengerSession extends ScavengerModel implements IScavengerSession {

  public user: string;
  private _hunt: ScavengerHunt;
  public active: boolean;

  /* * * * * Property Access * * * * */

  public get hunt(): ScavengerHunt {
    return this._hunt;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerSession) {
    super(data);

    this.user = !!data?.user ? data.user : `Explorer`;
    this._hunt = !!data?.hunt ? new ScavengerHunt(data?.hunt) : undefined;
    this.active = !!data?.active;
  }

  public toObject(): IScavengerSession {
    return Object.assign(super.toObject(), {
      user: this.user,
      hunt: this.hunt.toObject(),
      active: this.active,
    });
  }

  public setHunt(data: IScavengerHunt): void {
    this._hunt = new ScavengerHunt(data);
  }

}
