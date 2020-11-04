import { Component } from '@angular/core';
import { dropDownAnimation, fadeInOutQuickAnimation } from '../../animations/core-animations';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-root',
  templateUrl: './app.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './app.component.scss'],
  animations: [dropDownAnimation, fadeInOutQuickAnimation]
})
export class AppComponent {

  constructor(public appService: AppService) {
  }

}
