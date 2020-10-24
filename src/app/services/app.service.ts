import { Injectable } from '@angular/core';

declare const JXON: any;

@Injectable({
  providedIn: 'root',
})
export class AppService {

  public session: ISession;

  constructor() {
    const session: string = sessionStorage.getItem('scavenger-games-current-session');

    if (!session) {
      try {
        // load the current scavenger hunt in use by the user that is in storage
        this.session = JXON.prase(session);
      } catch (e: any) {
        // clear storage if we couldn't load the game
        sessionStorage.clear();
      }
    }

    //
  }

}
