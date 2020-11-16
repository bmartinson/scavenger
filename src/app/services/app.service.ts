import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { ScavengerSession } from '../model/scavenger-session';
import { ScavengerWaypoint } from '../model/scavenger-waypoint';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  private static SESSION_STORAGE_KEY = 'scavenger-games-current-session';

  /* * * * * UI Properties * * * * */
  private _showNavigation: boolean;

  public set showNavigation(value: boolean) {
    if (this._showNavigation !== value) {
      if (!this._navigation$) {
        this._navigation$ = new BehaviorSubject<boolean>(!!value);
      }

      this._showNavigation = value;
      this._navigation$.next(value);
    }
  }

  public get showNavigation(): boolean {
    return this._showNavigation;
  }

  /* * * * * Observables * * * * */
  private _navigation$: BehaviorSubject<boolean>;

  public get navigation$(): Observable<boolean> {
    if (!this._navigation$) {
      this._navigation$ = new BehaviorSubject<boolean>(!!this.showNavigation);
    }

    return this._navigation$.asObservable();
  }

  /* * * * * Application State * * * * */
  private session: ScavengerSession;

  public get hasHunt(): boolean {
    return !!this.session.hunt;
  }

  public get isHuntActive(): boolean {
    return !!this.session.hunt && !!this.session?.active;
  }

  public get isHuntInactive(): boolean {
    return !this.session?.hunt || !this.session?.active;
  }

  constructor() {
    const rawSession: string = localStorage.getItem(AppService.SESSION_STORAGE_KEY);

    if (!!rawSession) {
      try {
        // load the current scavenger hunt in use by the user that is in storage
        this.session = new ScavengerSession(JSON.parse(rawSession));
      } catch (e: any) {
        // clear storage if we couldn't load an existing game - the data was corrupted
        localStorage.clear();
      }
    }

    if (!this.session) {
      console.warn('creating session');

      this.session = new ScavengerSession({
        id: undefined,
        user: undefined,
        active: false,
        hunt: undefined,
      });
    }

    this.saveSession();

    console.warn(this.session);
  }

  public saveSession(): void {
    if (!this.session) {
      localStorage.clear();
    }

    try {
      localStorage.setItem(AppService.SESSION_STORAGE_KEY, JSON.stringify(this.session.toObject()));
    } catch (e) {
      console.error(`Could not save session`, e);
    }
  }

  /* * * * * Waypoint Interactions * * * * */

  public async scanWaypoint(idHunt: string, idWaypoint: string): Promise<ScavengerWaypointStatus> {
    if (!this.session.hunt) {
      // we do not have an active hunt, so we need to load from the server
      try {
        const hunt: IScavengerHunt = await this.loadTestingHunt(idHunt);

        // handle invalid hunts
        if (!hunt) {
          throw new Error('No valid hunt discovered');
        }

        // assign the hunt
        this.session.setHunt(hunt);

        return this.waypointCheck(idWaypoint);
      } catch (e) {
        return ScavengerWaypointStatus.NO_WAYPOINT;
      }
    }

    return this.waypointCheck(idWaypoint);
  }

  private waypointCheck(idWaypoint: string): ScavengerWaypointStatus {
    if (!this.session?.hunt) {
      return ScavengerWaypointStatus.NO_WAYPOINT;
    }

    const waypoint: ScavengerWaypoint = this.session.hunt.getWaypoint(idWaypoint);
    let status: ScavengerWaypointStatus = ScavengerWaypointStatus.VALID;
    const isLeaf: boolean = !waypoint.waypoints || waypoint.waypoints?.length === 0;

    if (!waypoint) {
      // the way point requested does not exist but the hunt that was provided does
      return ScavengerWaypointStatus.NO_WAYPOINT;
    } else if (waypoint.isStart) {
      this.session.active = true;

      status = ScavengerWaypointStatus.START;
    } else if (!this.session.active && this.session.hunt.type === ScavengerHuntType.ORDERED) {
      // if we are hitting a waypoint before activating the hunt in ordered hunts, send them back
      return ScavengerWaypointStatus.NO_WAYPOINT;
    } else if (!waypoint.valid) {
      // the user scanned a waypoint that is an invalid clue
      status = ScavengerWaypointStatus.INVALID;
    } else if (waypoint.captured) {
      status = ScavengerWaypointStatus.DUPLICATE;
    } else if (this.session.hunt.type === ScavengerHuntType.ORDERED && isLeaf && waypoint.valid) {
      // we are an ordered hunt that is at a valid leaf node, we have therefore finished the hunt
      status = ScavengerWaypointStatus.FINISH;
    } else if (
      this.session.hunt.type === ScavengerHuntType.UNORDERED &&
      this.session.hunt.capturedWaypointCount === this.session.hunt.validWaypointCount
    ) {
      // if we are an unordered scavenger hunt and we have gathered the total number of valid waypoints that need to be found
      // then they are finished
      status = ScavengerWaypointStatus.FINISH;
    }

    // check to see if we are out of order right now based on the current waypoint, otherwise consider ourselves captured
    const isChildOfCurrent: boolean = (
      waypoint.parent &&
      this.session.hunt.currentWaypoint &&
      this.session.hunt.currentWaypoint.id === waypoint.parent.id
    );

    if (
      this.session.hunt.type === ScavengerHuntType.ORDERED &&
      !waypoint.captured && this.session.active && !isChildOfCurrent && !waypoint.isStart
    ) {
      status = ScavengerWaypointStatus.OUT_OF_ORDER;
    }

    if (this.session.hunt.type === ScavengerHuntType.ORDERED) {
      if (
        status === ScavengerWaypointStatus.INVALID ||
        status === ScavengerWaypointStatus.VALID ||
        status === ScavengerWaypointStatus.START ||
        status === ScavengerWaypointStatus.FINISH
      ) {
        if (
          status === ScavengerWaypointStatus.VALID ||
          status === ScavengerWaypointStatus.START ||
          status === ScavengerWaypointStatus.FINISH
        ) {
          // track the current waypoint we are at
          this.setCurrentWaypoint(idWaypoint);
        }

        // mark the waypoint as captured
        waypoint.captured = true;

        // if we are marked to be a single path only while capturing, then we need to invalidate siblings
        if (!waypoint.valid && waypoint.parent?.waypoints && waypoint.parent.waypoints.length > 0) {
          for (const sibling of waypoint.parent.waypoints) {
            sibling.valid = false;
          }
        }
      }
    } else {
      if (
        status === ScavengerWaypointStatus.VALID ||
        status === ScavengerWaypointStatus.START ||
        status === ScavengerWaypointStatus.DUPLICATE ||
        status === ScavengerWaypointStatus.FINISH
      ) {
        // track the current waypoint we are at
        this.setCurrentWaypoint(idWaypoint);

        // unordered hunts are active if we are capturing a waypoint
        this.session.active = true;

        // mark the waypoint as captured
        waypoint.captured = true;
      }
    }

    // save the session activation change
    this.saveSession();

    return status;
  }

  public getWaypoint(idWaypoint: string): ScavengerWaypoint | undefined {
    if (!this.session?.hunt) {
      return undefined;
    }

    return this.session.hunt.getWaypoint(idWaypoint);
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

  /**
   * Updates the current waypoint in play for the current hunt.
   *
   * @param idWaypoint The id of the waypoint that is the current hunt waypoint.
   */
  private setCurrentWaypoint(idWaypoint: string): void {
    if (!this.session.hunt) {
      return;
    }

    this.session.hunt.idCurrentWaypoint = idWaypoint;
  }

  /* * * * * TESTING * * * * */

  private async loadTestingHunt(idHunt: string): Promise<IScavengerHunt> {
    if (idHunt !== '1') {
      return Promise.reject();
    }

    return Promise.resolve(
      {
        id: '1',
        name: 'Testing Hunt',
        type: ScavengerHuntType.ORDERED,
        singlePathOnly: false,
        startingWaypoint: {
          id: '1',
          name: 'Waypoint Tier 1: 1',
          value: 1,
          valid: true,
          dialog: ['Welcome To The Test'],
          outOfOrderDialog: undefined,
          captured: false,
          waypoints: [
            {
              id: '2',
              name: 'Waypoint Tier 2: 1',
              value: 1,
              valid: true,
              dialog: ['Tier 2'],
              outOfOrderDialog: undefined,
              captured: false,
              waypoints: [
                {
                  id: '31',
                  name: 'Waypoint Tier 3: 1',
                  value: 0,
                  valid: false,
                  dialog: ['Tier 3', 'False Clue 1'],
                  outOfOrderDialog: undefined,
                  captured: false,
                  waypoints: [],
                },
                {
                  id: '32',
                  name: 'Waypoint Tier 3: 2',
                  value: 1,
                  valid: true,
                  dialog: ['Tier 3', 'Clue'],
                  outOfOrderDialog: undefined,
                  captured: false,
                  waypoints: [
                    {
                      id: '4',
                      name: 'Waypoint Tier 4: 1',
                      value: 1,
                      valid: true,
                      dialog: ['Finishing Clue'],
                      outOfOrderDialog: undefined,
                      captured: false,
                      waypoints: [],
                    }
                  ],
                },
                {
                  id: '33',
                  name: 'Waypoint Tier 3: 3',
                  value: 0,
                  valid: false,
                  dialog: ['Tier 3', 'False Clue 2'],
                  outOfOrderDialog: undefined,
                  captured: false,
                  waypoints: [],
                }
              ],
            }
          ],
        },
        idCurrentWaypoint: '',
      },
    );
  }

}
