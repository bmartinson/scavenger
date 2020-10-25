import { IScavengerModel } from './scavenger-model.interface';

export interface IScavengerSession extends IScavengerModel {
  id: string;
  user: string;
  idHunt: string;
  active: boolean;
}
