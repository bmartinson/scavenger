import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../../styles/component-base.scss', './navigation.component.scss'],
})
export class NavigationComponent {

  constructor(public appService: AppService) {
  }

  /**
   * Used as an event handler when clicking on links that will be navigating away from
   * our website to an external website.
   */
  public onLeaving(): void {
    this.appService.showNavigation = false;
  }

}
