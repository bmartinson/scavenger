import { Component } from '@angular/core';
import { inOutAnimation } from '../../animations/core-animations';
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

  public isValid: boolean;

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

  constructor(public appService: AppService) {
    super(appService);
    this.isValid = false;

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
