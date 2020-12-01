import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-hunts',
  templateUrl: './hunts.component.html',
  styleUrls: ['./hunts.component.scss', '../../styles/route-component-base.scss', '../../styles/route-component-centered.scss']
})
export class HuntsComponent extends ScavengerRouteComponent {

  constructor(public appService: AppService, protected titleService: Title) {
    super(appService, titleService);

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Your Hunts`);
  }

}
