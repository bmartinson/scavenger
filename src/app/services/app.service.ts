import { Injectable } from '@angular/core';
import { IScavengerSession } from '../interface/scavenger-session.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private static SESSION_STORAGE_KEY = 'scavenger-games-current-session';

  private session: IScavengerSession;

  constructor() {
    const rawSession: string = localStorage.getItem(AppService.SESSION_STORAGE_KEY);

    if (!!rawSession) {
      try {
        // load the current scavenger hunt in use by the user that is in storage
        this.session = JSON.parse(rawSession);
      } catch (e: any) {
        // clear storage if we couldn't load an existing game - the data was corrupted
        localStorage.clear();
      }
    }

    if (!this.session) {
      // the session was no loaded successfully from local storage, so create a new session for the user
      const now: Date = new Date();
      const seed: number = Math.floor(Math.random() * 101);

      this.session = {
        id: `${seed}-${now.getUTCHours()}-${now.getUTCMinutes()}-${now.getUTCSeconds()}-${now.getUTCMilliseconds()}`,
        user: `Brian Martinson`,
        active: false,
        idHunt: '',
      };
    }

    this.saveSession();

    console.warn(localStorage.getItem(AppService.SESSION_STORAGE_KEY));

    setTimeout(() => {
      localStorage.clear();
      console.warn('cleared storage');
    }, 5000);
  }

  public saveSession(): void {
    if (!this.session) {
      localStorage.clear();
    }

    localStorage.setItem(AppService.SESSION_STORAGE_KEY, JSON.stringify(this.session));
  }

  /* * * * * Setters * * * * */

  /**
   * Updates the scavenger hunt game session with a new user name.
   *
   * @param value The user name to use for this user session.
   */
  public setUser(value: string): void {
    this.session.user = value;
  }

}
