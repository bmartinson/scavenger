import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as Cookies from 'js-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ScavengerHuntType } from '../enum/scavenger-hunt-type.enum';
import { ScavengerWaypointStatus } from '../enum/scavenger-waypoint.enum';
import { IScavengerHunt } from '../interface/scavenger-hunt.interface';
import { ScavengerHunt } from '../model/scavenger-hunt';
import { ScavengerSession } from '../model/scavenger-session';
import { ScavengerWaypoint } from '../model/scavenger-waypoint';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  public static EMAIL_REG_EX = `[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]+`;
  private static SESSION_STORAGE_KEY = 'scavenger-games-current-session';
  private static COOKIE_AUTH_KEY = 'scavenger-games-auth-token';

  /* * * * * UI Properties * * * * */
  private _showNavigation: boolean;
  private _showJournal: boolean;

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

  public set showJournal(value: boolean) {
    if (this._showJournal !== value) {
      if (!this._navigation$) {
        this._navigation$ = new BehaviorSubject<boolean>(!!value);
      }

      this._showJournal = value;
      this._navigation$.next(value);
    }
  }

  public get showJournal(): boolean {
    return this._showJournal;
  }

  /* * * * * Observables * * * * */
  private _navigation$: BehaviorSubject<boolean>;
  private _journal$: BehaviorSubject<boolean>;

  public get navigation$(): Observable<boolean> {
    if (!this._navigation$) {
      this._navigation$ = new BehaviorSubject<boolean>(!!this.showNavigation);
    }

    return this._navigation$.asObservable();
  }

  public get journal$(): Observable<boolean> {
    if (!this._journal$) {
      this._journal$ = new BehaviorSubject<boolean>(!!this.showJournal);
    }

    return this._journal$.asObservable();
  }

  /* * * * * Application State * * * * */
  private session: ScavengerSession;
  private _url: string;
  public firstName: string;
  public lastName: string;
  public organization: string;
  public email: string;
  private hasUserData: boolean;

  public get idUser(): number {
    const authToken: string = Cookies.get(AppService.COOKIE_AUTH_KEY);

    if (!authToken) {
      return 0;
    }

    const authArray: string[] = authToken.split('&');

    return +authArray[1].substr(2);
  }

  public get url(): string {
    return this._url;
  }

  public get hasHunt(): boolean {
    return !!this.session.hunt;
  }

  public get isHuntActive(): boolean {
    return !!this.session.hunt && !!this.session?.active;
  }

  public get isHuntInactive(): boolean {
    return !this.session?.hunt || !this.session?.active;
  }

  public get idHunt(): string {
    if (this.isHuntActive) {
      return this.session.hunt.id;
    }

    return undefined;
  }

  public get isHuntComplete(): boolean {
    if (this.isHuntActive) {
      return this.session.hunt.capturedValidWaypointCount === this.session.hunt.validWaypointCount;
    }

    return false;
  }

  public get isHuntSinglePathOnly(): boolean {
    return this.session?.hunt?.singlePathOnly;
  }

  public get huntType(): ScavengerHuntType {
    if (!this.session?.hunt) {
      return undefined;
    }

    return this.session?.hunt?.type;
  }

  public get discoveries(): ScavengerWaypoint[] {
    if (this.isHuntActive) {
      return this.session.hunt.capturedWaypoints;
    }

    return [];
  }

  public get isLoggedIn(): boolean {
    return this.validateToken(Cookies.get(AppService.COOKIE_AUTH_KEY));
  }

  constructor(private router: Router, private http: HttpClient) {
    this.hasUserData = false;

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this._url = (event as NavigationEnd).urlAfterRedirects;

        // remove the first character '/'
        if (this._url?.length > 0) {
          this._url = this._url.substring(1, this._url.length);
        }

        // cut off query parameters
        const idxQuery: number = this._url?.indexOf('?');
        if (idxQuery >= 0 && this._url?.length > 0) {
          this._url = this._url.substring(0, idxQuery);
        }

        // cut off any remaining sub routes
        const idxSubRoute: number = this._url?.indexOf('/');
        if (idxSubRoute >= 0 && this._url?.length > 0) {
          this._url = this._url.substring(0, idxSubRoute);
        }
      }
    });

    const rawSession: string = localStorage.getItem(AppService.SESSION_STORAGE_KEY);

    if (!!rawSession) {
      try {
        // load the current scavenger hunt in use by the user that is in storage
        this.session = new ScavengerSession(JSON.parse(rawSession));

        // if the hunt in local storage is older than a day, clear it
        if (new Date().getTime() - this.session.getStartTime().getTime() > 86400000) {
          this.session = null;
          localStorage.clear();
        }
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
        startTime: new Date().toString(),
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

  private getUserData(): void {
    this.hasUserData = true;

    const params = new HttpParams().set('id', String(this.idUser));

    this.request('GET', 'https://www.scavenger.games/api/user', params).then((rspData: any) => {
      this.hasUserData = true;
      this.firstName = rspData.data[0].firstName;
      this.lastName = rspData.data[0].lastName;
      this.organization = rspData.data[0].organization;
      this.email = rspData.data[0].email;
    }).catch(() => {
      this.hasUserData = false;
    });
  }

  public getHuntsForUser(): Promise<ScavengerHunt[]> {
    const params = new HttpParams().set('id', String(this.idUser));

    return this.request('GET', 'https://www.scavenger.games/api/hunts', params).then((rspData: any) => {
      if (rspData.status === 'ok' && rspData.data?.length === 1) {
        const hunts: ScavengerHunt[] = [];

        for (const huntData of rspData) {
          hunts.push(new ScavengerHunt(huntData));
        }

        return Promise.resolve(hunts);
      } else {
        return Promise.reject(rspData);
      }
    });
  }

  public signIn(email: string, password: string): Promise<any> {
    const params = new HttpParams();
    const data: any = {
      email: encodeURIComponent(email),
      password: CryptoJS.MD5(password).toString(),
    };

    return this.request('POST', 'https://www.scavenger.games/api/authorize', params, data).then((rspData: any) => {
      if (rspData.status === 'ok' && rspData.data?.length === 1) {
        this.validateToken(rspData.data[0].authToken);

        this.hasUserData = true;
        this.firstName = rspData.data[0].firstName;
        this.lastName = rspData.data[0].lastName;
        this.organization = rspData.data[0].organization;
        this.email = rspData.data[0].email;

        return rspData;
      } else {
        return Promise.reject(rspData);
      }
    });
  }

  public signOut(): void {
    this.logout();
    this.router.navigate(['/']).catch(() => {
    });
  }

  public signUp(email: string, password: string, firstName: string, lastName: string, organization: string): Promise<any> {
    const params = new HttpParams();
    const data: any = {
      email: encodeURIComponent(email),
      password: CryptoJS.MD5(password).toString(),
      firstName: encodeURIComponent(firstName),
      lastName: encodeURIComponent(lastName),
    };

    if (!!organization) {
      data.organization = encodeURIComponent(organization);
    }

    return this.request('POST', 'https://www.scavenger.games/api/user', params, data).then((rspData: any) => {
      if (rspData.status === 'ok' && rspData.data?.length === 1) {
        this.validateToken(rspData.data[0].authToken);

        return rspData;
      } else {
        return Promise.reject(rspData);
      }
    });
  }

  public logout(): void {
    Cookies.remove(AppService.COOKIE_AUTH_KEY);
    this.firstName = this.lastName = this.organization = this.email = null;
  }

  public validateToken(authToken: string): boolean {
    // If there is no authToken, then just return false here
    if (!authToken) {
      return false;
    }

    const authArray: string[] = authToken.split('&');
    const timeStamp: number = Math.floor(Date.now() / 1000);
    const isValid: boolean = ((+authArray[0].substr(2) - 86400) > timeStamp);

    if (!isValid) {
      this.logout();
    } else if (!Cookies.get(AppService.COOKIE_AUTH_KEY)) {
      Cookies.set(AppService.COOKIE_AUTH_KEY, authToken, { expires: 30, path: '/' });
    }

    // make sure user data is fetches when accessing the site
    if (!this.hasUserData) {
      this.getUserData();
    }

    return isValid;
  }

  /* * * * * Networking Support * * * * */

  /**
   * Performs an HTTP request based on the type and destination provided.
   *
   * @param type The type of HTTP request to perform.
   * @param url The URL of the endpoint to request.
   * @param params Optional parameters associated with the request.
   */
  private request(type: 'GET' | 'POST' | 'DELETE' | 'PATCH', url: string, params?: HttpParams, data?: any): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders();

    if (Cookies.get(AppService.COOKIE_AUTH_KEY)) {
      // headers = headers.set('Authorization', `${Cookies.get(AppService.COOKIE_AUTH_KEY)}`);
      params = params.set('authToken', Cookies.get(AppService.COOKIE_AUTH_KEY));

      if (!!data) {
        data.authToken = Cookies.get(AppService.COOKIE_AUTH_KEY);
      }
    }

    if (type === 'GET') {
      return this.http.get(url, { headers, params }).pipe(shareReplay()).toPromise();
    } else if (type === 'POST') {
      if (!data) {
        Promise.reject('no data provided');
      }

      // headers = headers.set('Content-Type', 'application/json');

      return this.http.post(url, JSON.stringify(data), { headers, params }).pipe(shareReplay()).toPromise();
    } else if (type === 'PATCH') {
      if (!data) {
        Promise.reject('no data provided');
      }

      // headers = headers.set('Content-Type', 'application/json');

      return this.http.patch(url, JSON.stringify(data), { headers, params }).pipe(shareReplay()).toPromise();
    } else if (type === 'DELETE') {
      if (!data) {
        Promise.reject('no data provided');
      }

      // headers = headers.set('Content-Type', 'application/json');

      // return this.http.delete(url, JSON.stringify(data), { headers, params }).pipe(shareReplay()).toPromise();
    } else {
      Promise.reject('invalid request type');
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

        return this.waypointCheck(idHunt, idWaypoint);
      } catch (e) {
        return ScavengerWaypointStatus.NO_WAYPOINT;
      }
    }

    return this.waypointCheck(idHunt, idWaypoint);
  }

  private waypointCheck(idHunt: string, idWaypoint: string): ScavengerWaypointStatus {
    if (!this.session?.hunt) {
      return ScavengerWaypointStatus.NO_WAYPOINT;
    } else if (this.isHuntActive && this.session.hunt.id !== idHunt) {
      return ScavengerWaypointStatus.WRONG_HUNT;
    }

    const waypoint: ScavengerWaypoint = this.session.hunt.getWaypoint(idWaypoint);
    let status: ScavengerWaypointStatus = ScavengerWaypointStatus.VALID;
    const isLeaf: boolean = waypoint && (!waypoint.waypoints || waypoint.waypoints?.length === 0);

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
          status === ScavengerWaypointStatus.START && !this.session.hunt.idCurrentWaypoint ||
          status === ScavengerWaypointStatus.FINISH
        ) {
          // track the current waypoint we are at
          this.setCurrentWaypoint(idWaypoint);
        }

        // mark the waypoint as captured
        waypoint.captured = true;

        // if we are marked to be a single path only while capturing, then we need to invalidate siblings
        if (this.isHuntSinglePathOnly && !!waypoint.valid && waypoint?.parent?.waypoints?.length > 0) {
          for (const sibling of waypoint.parent.waypoints) {
            if (sibling !== waypoint) {
              sibling.valid = false;
            }
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
    if (idHunt !== 'lwe-explorer' && idHunt !== 'lwe-venom') {
      return Promise.reject();
    }

    if (idHunt === 'lwe-explorer') {
      return Promise.resolve(
        {
          id: 'lwe-explorer',
          name: 'Lindsay Wildlife Explorer',
          type: ScavengerHuntType.ORDERED,
          singlePathOnly: false,
          startingWaypoint: {
            id: '1',
            name: 'Getting Started',
            description: `<p>Let's see how well you know Lindsay Wildlife Experience and the animal ambassador's that call it home!</p><p>Use the clues that are listed on your screen at each waypoint to help you find the next stop on today's animal adventure. When you think you've found the next waypoint, just use your camera to scan the QR code and see if you're right!<p>`,
            clues: [`I'm 46 years old.`, `I have a 6' wingspan.`, `You can find me out front.`],
            interactiveType: 'image',
            interactiveSrc: 'assets/hunt-content/explorer.png',
            value: 1,
            valid: true,
            dialog: ['Welcome to Lindsay!', 'Are you ready to explore?'],
            outOfOrderDialog: undefined,
            captured: false,
            waypoints: [
              {
                id: '2',
                name: 'Lord Richard',
                // tslint:disable-next-line: max-line-length
                description: `<p>Lord Richard is one of the oldest Turkey Vultures in the world and has called Lindsay Wildlife home since 1986.</p><p>Turkey Vultures are cool because they have a nearly six foot wide wingspan. They also fly in a wobbly motion and soar for long distances using heat thermals in the air.</p>`,
                clues: ['I have red feathers.', `I'm a female bird.`, `I don't have a wing injury.`],
                interactiveType: 'video',
                interactiveSrc: 'assets/hunt-content/t-vulture.mp4',
                value: 1,
                valid: true,
                dialog: ['This is Lord Richard!'],
                outOfOrderDialog: undefined,
                captured: false,
                waypoints: [
                  {
                    id: '31',
                    name: 'Red',
                    description: `<p>You found Red, the <b>Red Shouldered Hawk</b>. While magnificent in his own right, and while he does have red feathers, he doesn't match the description of your last clues! Check your discoveries and try again!</p>`,
                    clues: [],
                    interactiveType: 'none',
                    value: 0,
                    valid: false,
                    dialog: ['Not quite!', 'This is Red!', 'A Red Shouldered Hawk'],
                    outOfOrderDialog: undefined,
                    captured: false,
                    waypoints: [],
                  },
                  {
                    id: '32',
                    name: 'Fire',
                    description: `<p>You found Fire, one of our two <b>Red Tailed Hawks</b>. She has been with the organization since 1990 and was discovered in Castro Valley. You can spot Red Tailed Hawks frequently around the Bay Area by looking at their beautiful red tails.</p><p>Of all of the birds that call Lindsay home, she is the biggest! Weighing in at over 1kg!! Fire is one of two Red Tailed Hawks that live at Lindsay Wildlife, and like most bird species, she's bigger than her male counterparts. If you see Rufous around, take a look and notice how he's smaller in size.</p>`,
                    clues: [`I hover while looking for my prey.`, `My eyes will be bright red when I'm fully grown.`, `I'm a rare captive species.`, `You can find me in the nature cove.`],
                    interactiveType: 'none',
                    value: 1,
                    valid: true,
                    dialog: ['Well done!', 'You found Fire!', `The Red Tailed Hawk!`],
                    outOfOrderDialog: undefined,
                    captured: false,
                    waypoints: [
                      {
                        id: '4',
                        name: 'Dragon',
                        description: `<p>Great job finding Dragon, the White-Tailed Kite! It is super special that Dragon lives with us because very few White-Tailed Kits live in captivity due to their social nature. Dragon, however, came to our rehabilitation hospital note once, but twice! And as a result of her head trauma, she is too friendly with humans to survive in the wild. She lives a super happy life out here in the Nature Cove and loves to yell.</p>`,
                        interactiveSrc: 'assets/hunt-content/white-tailed-kite.mp3',
                        interactiveType: 'audio',
                        clues: ['We hate to say goodbye, so walk by Hello!', `Continue your adventure inside!`],
                        value: 1,
                        valid: true,
                        dialog: [`You've found Dragon!`],
                        outOfOrderDialog: undefined,
                        captured: false,
                        waypoints: [
                          {
                            id: '5',
                            name: 'The Exhibit Hall',
                            description: `<p>Thank you so much for joining us and participating in our scavenger hunt. We hope you had fun. Please enjoy the rest of your day at Lindsay Wildlife!</p>`,
                            interactiveType: 'none',
                            clues: [],
                            value: 1,
                            valid: true,
                            dialog: [`Way to go!`, `You're an expert animal explorer!`],
                            outOfOrderDialog: undefined,
                            captured: false,
                            waypoints: [],
                          }
                        ],
                      }
                    ],
                  },
                  {
                    id: '33',
                    name: 'Rufous',
                    description: `<p>You're so close! You spotted the same species of hawk that we are looking for. Rufous is a <b>Red Tailed Hawk</b>. He's been at Lindsay Wildlife for a while.</p>`,
                    clues: ['Looks just like me.', `I'm a female.`, `I'm bigger.`],
                    interactiveType: 'none',
                    value: 0,
                    valid: false,
                    dialog: ['So close!', 'This is Rufous!'],
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
    } else if (idHunt === 'lwe-venom') {
      return Promise.resolve(
        {
          id: 'lwe-venom',
          name: 'Lindsay Wildlife Venomous Finder',
          type: ScavengerHuntType.UNORDERED,
          singlePathOnly: false,
          startingWaypoint: {
            id: '1',
            name: 'Getting Started',
            description: `<p>Let's see if you know which animals to stay away from!</p><p>Use the clues that are listed on your screen to help you safely find and learn about the venomous animals that call Lindsay home. When you think you've found the next one, just use your camera to scan the QR code and see if you're right! You aren't done until you find them all!<p>`,
            clues: [`You can find me inside.`, `Sometimes I don't have legs.`, `Other times, I have a pointy tail.`, `Sometimes I'm small and you don't notice me.`],
            interactiveType: 'image',
            interactiveSrc: 'assets/hunt-content/explorer.png',
            value: 1,
            valid: true,
            dialog: ['Welcome to Lindsay!', `Let's go find some animals!`],
            outOfOrderDialog: undefined,
            captured: false,
            waypoints: [
              {
                id: '2',
                name: 'Snek',
                // tslint:disable-next-line: max-line-length
                description: `<p>I'm probably one of the most common animals you think of when you think of venomous animals! I am a Western Diamondback Rattlesnake!</p><p>People think of me so often when they think of venomous animals that many other snakes that aren't venomous, like Gopher Snakes, will move their tails around to rustle in the grass so they sound like me!</p>`,
                clues: undefined,
                interactiveType: 'none',
                interactiveSrc: undefined,
                value: 1,
                valid: true,
                dialog: ['Great find!', `Did you hear me rattle?`],
                outOfOrderDialog: undefined,
                captured: false,
                waypoints: undefined,
              },
              {
                id: '3',
                name: 'Elvira 8.0',
                // tslint:disable-next-line: max-line-length
                description: `<p>My name is Elvira and I am a Black Widow!</p><p>Did you know that male and female Black Widow spiders look different? The females, like me, are the most distinctive, with shiny black bodies and a red hourglass-shaped marking on the underside of their round abdomen. Just like in the bird world, female Black Widows are larger than our male counterparts.</p>`,
                clues: undefined,
                interactiveType: 'none',
                interactiveSrc: undefined,
                value: 1,
                valid: true,
                dialog: ['Nice!', 'Can you spot me in my enclosure?'],
                outOfOrderDialog: undefined,
                captured: false,
                waypoints: undefined,
              },
              , {
                id: '4',
                name: 'Yuma',
                // tslint:disable-next-line: max-line-length
                description: `<p>I'm Yuma, and I am a Desert Scorpion! I don't inject venom by biting you or by using my pincher claws. Instead, I can inject venom into my prey when hunting using my tail!</p>`,
                clues: undefined,
                interactiveType: 'none',
                interactiveSrc: undefined,
                value: 1,
                valid: true,
                dialog: ['Good job!', 'Watch out for my tail!'],
                outOfOrderDialog: undefined,
                captured: false,
                waypoints: undefined,
              },
              {
                id: '5',
                name: 'Harriet',
                // tslint:disable-next-line: max-line-length
                description: `<p>Don't worry, I'm not venomous! I'm a Tarantula, and although I'm larger than most spiders, I'm actually quite delicate and sweet. I can't kill you by injecting you with any venom.</p><p>Did you know that you can find lots of spiders just like me on Mount Diablo? Keep an eye out the next time you go on a Lindsay Wildlife Hike!</p>`,
                clues: undefined,
                interactiveType: 'none',
                interactiveSrc: undefined,
                value: 1,
                valid: false,
                dialog: [`Don't be scared!`, `I'm not venomous!`],
                outOfOrderDialog: undefined,
                captured: false,
                waypoints: undefined,
              }
            ],
          },
          idCurrentWaypoint: '',
        },
      );
    }
  }

}
