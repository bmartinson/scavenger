import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { ScavengerHuntType } from '../../enum/scavenger-hunt-type.enum';
import { QFButtonStyle } from '../../forms/components/button/button.component';
import { ScavengerWaypoint } from '../../model/scavenger-waypoint';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../../styles/component-base.scss', './journal.component.scss']
})
export class JournalComponent implements AfterViewInit, OnInit {

  public QFButtonStyle = QFButtonStyle;
  public showDiscoveries: boolean;
  private _discoveries: ScavengerWaypoint[];
  public isHuntComplete: boolean;
  public initialized: boolean;

  public get discoveries(): ScavengerWaypoint[] {
    if (!this._discoveries) {
      this._discoveries = [];
    }

    return this._discoveries;
  }

  constructor(public appService: AppService, private router: Router, private changeRef: ChangeDetectorRef) {
    this.showDiscoveries = false;
    this.initialized = false;
  }

  public ngAfterViewInit(): void {
    this.initialized = true;
  }

  public ngOnInit(): void {
    // only show discoveries for valid captures when performing ordered hunts
    // if (this.appService.huntType === ScavengerHuntType.ORDERED) {
    //   this._discoveries = this.appService.validDiscoveries;
    // } else {
    //   this._discoveries = this.appService.discoveries;
    // }

    this._discoveries = this.appService.validDiscoveries;
    this.isHuntComplete = this.appService.isHuntComplete;

    if (!(this.changeRef as ViewRef).destroyed) {
      this.changeRef.detectChanges();
    }
  }

  public onToggleDiscoveries(state: boolean): void {
    this.showDiscoveries = !!state;
  }

  public onResetGame(): void {
    localStorage.clear();
    this.onToggleDiscoveries(false);

    this.router.navigate(['/', this.appService.idHunt]).catch(() => {
    });
  }

  public calculateTop(el: HTMLElement): string {
    if (this.showDiscoveries) {
      return '0px';
    }

    if (el?.getBoundingClientRect()?.height > 0) {
      if (this.initialized) {
        return (-el.getBoundingClientRect().height + 55) + 'px';
      } else {
        return -el.getBoundingClientRect().height + 'px';
      }
    } else {
      return '0px';
    }
  }

}
