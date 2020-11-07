import { Component, Input } from '@angular/core';

@Component({
  selector: 'scavenger-qr-find',
  templateUrl: './qr-find.component.html',
  styleUrls: ['../../styles/component-base.scss', './qr-find.component.scss']
})
export class QRFindComponent {

  /* * * * * Template Bindings * * * * */
  @Input() public isValid: boolean;

}
