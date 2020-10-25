import { IScavengerModel } from './scavenger-model.interface';

export interface IScavengerSession extends IScavengerModel {
  user: string;
  idHunt: string;
  active: boolean;
}
