import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppService } from '../../services/app.service';
import { ScavengerRouteComponent } from '../scavenger-route/scavenger-route.component';

@Component({
  selector: 'scavenger-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['../../styles/route-component-base.scss', '../../styles/route-component-centered.scss', '../../styles/route-component-full-page.scss']
})
export class PrivacyComponent extends ScavengerRouteComponent {

  constructor(public appService: AppService, protected titleService: Title) {
    super(appService, titleService);

    this.titleService.setTitle(`${ScavengerRouteComponent.BASE_PAGE_TITLE} - Privacy`);
  }

}
