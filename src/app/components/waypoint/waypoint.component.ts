import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { inOutAnimation } from '../../animations/core-animations';
import { ScavengerWaypointStatus } from '../../enum/scavenger-waypoint.enum';
import { ScavengerHuntRouteData } from '../../model/scavenger-hunt-route-data';
import { ScavengerWaypoint } from '../../model/scavenger-waypoint';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-waypoint',
  templateUrl: './waypoint.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './waypoint.component.scss'],
  animations: [inOutAnimation]
})
export class WaypointComponent extends ScavengerRouteComponent {

  /* * * * * Internal Data * * * * */
  private get waypointStatus(): ScavengerWaypointStatus {
    return (this.activatedRoute.snapshot?.data?.waypointData as ScavengerHuntRouteData)?.waypointStatus;
  }

  /* * * * * Animated Control * * * * */
  public showTitle: boolean;
  public showContent: boolean;

  /* * * * * Template Display Properties * * * * */
  public title: string;

  public get waypointStatusIcon(): ScavengerWaypointStatus {
    if (
      this.waypointStatus === ScavengerWaypointStatus.DUPLICATE &&
      this.waypoint && (!this.waypoint.waypoints || this.waypoint.waypoints.length === 0)
    ) {
      return ScavengerWaypointStatus.FINISH;
    }

    return this.waypointStatus;
  }

  public get waypoint(): ScavengerWaypoint {
    return (this.activatedRoute.snapshot?.data?.waypointData as ScavengerHuntRouteData)?.waypoint;
  }

  public get isOutOfOrder(): boolean {
    return this.waypointStatus === ScavengerWaypointStatus.OUT_OF_ORDER;
  }

  private get defaultTitle(): string {
    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.START:
        return 'Welcome!';

      case ScavengerWaypointStatus.FINISH:
        return 'You did it!';

      case ScavengerWaypointStatus.DUPLICATE:
        return 'You\'re back!';

      case ScavengerWaypointStatus.INVALID:
        return 'Oops, wrong one!';

      case ScavengerWaypointStatus.OUT_OF_ORDER:
        return 'Not quite!';

      default:
        return 'Great find!';
    }
  }

  public get subtitle(): string {
    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.START:
        return 'You found the start of the trail';

      case ScavengerWaypointStatus.FINISH:
        return 'You completed the trail';

      case ScavengerWaypointStatus.DUPLICATE:
        return 'You found this waypoint earlier';

      case ScavengerWaypointStatus.INVALID:
        return 'Check your clues';

      case ScavengerWaypointStatus.OUT_OF_ORDER:
        return 'You\'re getting ahead of yourself';

      default:
        return 'You found a waypoint';
    }
  }

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute, protected titleService: Title) {
    super(appService, titleService);

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Waypoint`);

    let dialog: string[] = [];
    dialog.push(this.defaultTitle);

    if (this.waypointStatus === ScavengerWaypointStatus.OUT_OF_ORDER) {
      if (this.waypoint?.outOfOrderDialog && this.waypoint.outOfOrderDialog.length > 0) {
        dialog = [].concat(this.waypoint.outOfOrderDialog);
      }
    } else {
      if (this.waypoint?.dialog && this.waypoint.dialog.length > 0) {
        dialog = [].concat(this.waypoint.dialog);
      }
    }

    setTimeout(() => {
      this.showTitle = true;

      this.renderDialog(dialog, 0);
    }, 3000);
  }

  private renderDialog(dialog: string[], index: number): void {
    if (index === dialog.length) {
      // we have reached the end of our dialog, render the content of the page
      this.showContent = true;
      return;
    }

    // set the dialog to display and render it
    this.title = dialog[index];
    this.showTitle = true;

    setTimeout(() => {
      // after some time, hide the title
      this.showTitle = false;

      setTimeout(() => {
        // after the title is hidden, render the next piece of dialog
        this.renderDialog(dialog, index + 1);
      }, 750);
    }, Math.max(1500 + (100 * (dialog[index].length / dialog[0].length)), 1500));
  }

  public onPlayAudio(): void {
    if (this.waypoint?.interactiveType === 'audio' && this.appService.embeddedCache[this.waypoint.interactiveSrc]) {
      (this.appService.embeddedCache[this.waypoint.interactiveSrc] as any).play();
    }
  }

}
