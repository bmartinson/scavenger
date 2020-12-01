import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ScavengerHunt } from '../model/scavenger-hunt';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class HuntsService implements Resolve<ScavengerHunt[]> {

  constructor(private appService: AppService) {
  }

  public resolve(): Promise<ScavengerHunt[]> {
    return this.appService.getHuntsForUser().then((hunts) => {
      return hunts;
    }).catch(() => {
      return [];
    });
  }

}
