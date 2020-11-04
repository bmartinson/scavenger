import { Component } from '@angular/core';
import { inOutAnimation } from '../../animations/core-animations';

@Component({
  selector: 'scavenger-no-clue',
  templateUrl: './no-clue.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './no-clue.component.scss'],
  animations: [inOutAnimation]
})
export class NoClueComponent {

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
