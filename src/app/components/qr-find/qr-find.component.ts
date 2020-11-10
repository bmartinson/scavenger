import { Component, Input } from '@angular/core';
import { ScavengerWaypointStatus } from '../../enum/scavenger-waypoint.enum';

@Component({
  selector: 'scavenger-qr-find',
  templateUrl: './qr-find.component.html',
  styleUrls: ['../../styles/component-base.scss', './qr-find.component.scss']
})
export class QRFindComponent {

  @Input() private waypointStatus: ScavengerWaypointStatus;

  public get isValid(): boolean {
    return this.waypointStatus !== ScavengerWaypointStatus.INVALID && this.waypointStatus !== ScavengerWaypointStatus.OUT_OF_ORDER;
  }

  public get icon(): string {
    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.START:
        return 'map-signs';

      case ScavengerWaypointStatus.FINISH:
        return 'route';

      case ScavengerWaypointStatus.INVALID:
        return 'map';

      default:
        return 'street-view';
    }
  }

  public get iconTransform(): string {
    switch (this.waypointStatus) {
      case ScavengerWaypointStatus.INVALID:
        return 'rotate(-30deg)';

      default:
        return undefined;
    }
  }

}
