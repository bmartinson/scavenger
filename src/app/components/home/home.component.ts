import { Component } from '@angular/core';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/route-component-base.scss', '../../styles/route-component-centered.scss']
})
export class HomeComponent extends ScavengerRouteComponent {
}
