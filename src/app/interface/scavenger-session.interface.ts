import { IScavengerHunt } from './scavenger-hunt.interface';
import { IScavengerModel } from './scavenger-model.interface';

export interface IScavengerSession extends IScavengerModel {
  id: string;
  user: string;
  hunt: IScavengerHunt;
  active: boolean;
  startTime: string;
}
