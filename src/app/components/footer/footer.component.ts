import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'scavenger-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../../styles/component-base.scss', './footer.component.scss'],
})
export class FooterComponent {

  public version: string;

  public constructor() {
    this.version = `v${environment.version}`;
  }

}
