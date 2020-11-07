import { IScavengerSession } from '../interface/scavenger-session.interface';
import { ScavengerHunt } from './scavenger-hunt';
import { ScavengerModel } from './scavenger-model';

export class ScavengerSession extends ScavengerModel implements IScavengerSession {

  private _user: string;
  private _hunt: ScavengerHunt;
  private _active: boolean;

  /* * * * * Property Access * * * * */

  public get user(): string {
    return this._user;
  }

  public get hunt(): ScavengerHunt {
    return this._hunt;
  }

  public get active(): boolean {
    return this._active;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerSession) {
    super(data);

    this._user = !!data?.user ? data.user : `Explorer`;
    this._hunt = !!data?.hunt ? new ScavengerHunt(data?.hunt) : undefined;
    this._active = !!data?.active;
  }

  public toObject(): IScavengerSession {
    return Object.assign(super.toObject(), {
      user: this.user,
      hunt: this.hunt.toObject(),
      active: this.active,
    });
  }

}
