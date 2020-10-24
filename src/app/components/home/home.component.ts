import { Component } from '@angular/core';
import { inOutAnimation } from '../../animations/core-animations';

@Component({
  selector: 'scavenger-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './home.component.scss'],
  animations: [inOutAnimation]
})
export class HomeComponent {

  public showTitle: boolean;
  public showContent: boolean;

  constructor() {
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
