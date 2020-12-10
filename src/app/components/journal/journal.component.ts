import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { dropDownAnimation } from '../../animations/core-animations';
import { QFButtonStyle } from '../../forms/components/button/button.component';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../../styles/component-base.scss', './journal.component.scss'],
  animations: [dropDownAnimation, trigger(
    'contentDropDownAnimation',
    [
      transition(
        ':enter',
        [
          style({ top: '-100%', position: 'absolute' }),
          animate('.5s ease-out', style({ top: 0, position: 'absolute' })),
        ],
      ),
      transition(
        ':leave',
        [
          style({ top: '0' }),
          animate('.5s ease-in', style({ top: '-100%', position: 'absolute' })),
        ],
      ),
    ],
  )]
})
export class JournalComponent {

  public QFButtonStyle = QFButtonStyle;
  public showDiscoveries: boolean;

  constructor(public appService: AppService) {
    this.showDiscoveries = false;
  }

  public onToggleDiscoveries(state: boolean): void {
    this.showDiscoveries = !!state;
  }

}
