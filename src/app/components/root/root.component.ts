import { Component, ElementRef } from '@angular/core';
import { dropDownAnimation, fadeInOutQuickAnimation } from '../../animations/core-animations';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-root',
  templateUrl: './root.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './root.component.scss'],
  animations: [dropDownAnimation, fadeInOutQuickAnimation]
})
export class RootComponent {

  public constructor(public appService: AppService, private elRef: ElementRef) {
  }

  /**
   * Event handler for when the route changes so we can ensure we are always at the top of the page.
   */
  public onActivate(): void {
    this.elRef?.nativeElement?.scrollTo(0, 0);
  }

}
