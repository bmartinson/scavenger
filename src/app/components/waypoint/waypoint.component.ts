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

  private static TITLE_SUCCESS = 'Great find!';
  private static TITLE_FAILURE = 'Not quite!';
  private static SUBTITLE_SUCCESS = 'You found a waypoint';
  private static SUBTITLE_FAILURE = 'Check your clues';

  /* * * * * Animated Control * * * * */
  public showTitle: boolean;
  public showContent: boolean;

  /* * * * * Template Display Properties * * * * */
  public get waypointStatus(): ScavengerWaypointStatus {
    return (this.activatedRoute.snapshot?.data?.waypointData as ScavengerHuntRouteData)?.waypointStatus;
  }

  public get waypoint(): ScavengerWaypoint {
    return (this.activatedRoute.snapshot?.data?.waypointData as ScavengerHuntRouteData)?.waypoint;
  }

  public get isValid(): boolean {
    return this.waypointStatus !== ScavengerWaypointStatus.INVALID && this.waypointStatus !== ScavengerWaypointStatus.OUT_OF_ORDER;
  }

  public get title(): string {
    if (this.isValid) {
      return WaypointComponent.TITLE_SUCCESS;
    } else {
      return WaypointComponent.TITLE_FAILURE;
    }
  }

  public get subtitle(): string {
    if (this.isValid) {
      return WaypointComponent.SUBTITLE_SUCCESS;
    } else {
      return WaypointComponent.SUBTITLE_FAILURE;
    }
  }

  constructor(public appService: AppService, private activatedRoute: ActivatedRoute, protected titleService: Title) {
    super(appService, titleService);

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Waypoint`);

    setTimeout(() => {
      this.showTitle = true;

      setTimeout(() => {
        this.showTitle = false;

        setTimeout(() => {
          this.showContent = true;
        }, 750);
      }, 1500);
    }, 3000);
  }

}
