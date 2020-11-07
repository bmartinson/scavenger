import { IScavengerSession } from '../interface/scavenger-session.interface';
import { ScavengerModel } from './scavenger-model';

export class ScavengerSession extends ScavengerModel implements IScavengerSession {

  private _user: string;
  private _idHunt: string;
  private _active: boolean;

  /* * * * * Property Access * * * * */

  public get user(): string {
    return this._user;
  }

  public get idHunt(): string {
    return this._idHunt;
  }

  public get active(): boolean {
    return this._active;
  }

  /* * * * * Core Class Implementation * * * * */

  constructor(data?: IScavengerSession) {
    super(data);

    this._user = !!data?.user ? data.user : `Explorer`;
    this._idHunt = String(data?.idHunt);
    this._active = !!data?.active;
  }

  public toObject(): IScavengerSession {
    return Object.assign(super.toObject(), {
      user: this.user,
      idHunt: this.idHunt,
      active: this.active,
    });
  }

}
