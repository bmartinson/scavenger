import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private appService: AppService) {
  }

}
