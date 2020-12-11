import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dropDownAnimation } from '../../animations/core-animations';
import { QFButtonStyle } from '../../forms/components/button/button.component';
import { ScavengerWaypoint } from '../../model/scavenger-waypoint';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../../styles/component-base.scss', './journal.component.scss'],
  animations: [dropDownAnimation, trigger(
    'contentDropDownAnimation',
    [
      transition(
        ':enter',
        [
          style({ top: '-100%', position: 'absolute' }),
          animate('.5s ease-out', style({ top: 0, position: 'absolute' })),
        ],
      ),
      transition(
        ':leave',
        [
          style({ top: '0' }),
          animate('.5s ease-in', style({ top: '-100%', position: 'absolute' })),
        ],
      ),
    ],
  )]
})
export class JournalComponent implements OnInit {

  public QFButtonStyle = QFButtonStyle;
  public showDiscoveries: boolean;
  private _discoveries: ScavengerWaypoint[];
  public isHuntComplete: boolean;

  public get discoveries(): ScavengerWaypoint[] {
    if (!this._discoveries) {
      this._discoveries = [];
    }

    return this._discoveries;
  }

  constructor(public appService: AppService, private router: Router) {
    this.showDiscoveries = false;
  }

  public ngOnInit(): void {
    this._discoveries = this.appService.discoveries;
    this.isHuntComplete = this.appService.isHuntComplete;
  }

  public onToggleDiscoveries(state: boolean): void {
    this.showDiscoveries = !!state;
  }

  public onResetGame(): void {
    localStorage.clear();

    this.router.navigate(['/', this.appService.idHunt]).catch(() => {
    });
  }

}
