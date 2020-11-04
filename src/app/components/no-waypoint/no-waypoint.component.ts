import { Component } from '@angular/core';
import { inOutAnimation } from '../../animations/core-animations';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-no-waypoint',
  templateUrl: './no-waypoint.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './no-waypoint.component.scss'],
  animations: [inOutAnimation]
})
export class NoWaypointComponent extends ScavengerRouteComponent {

  public showTitle: boolean;
  public showContent: boolean;

  constructor(public appService: AppService) {
    super(appService);

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
