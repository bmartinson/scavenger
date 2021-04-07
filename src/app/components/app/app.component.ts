import { Component, ElementRef } from '@angular/core';
import { dropDownAnimation, fadeInOutQuickAnimation } from '../../animations/core-animations';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'scavenger-root',
  templateUrl: './app.component.html',
  styleUrls: ['../../styles/route-component-base.scss', './app.component.scss'],
  animations: [dropDownAnimation, fadeInOutQuickAnimation]
})
export class AppComponent {

  public constructor(public appService: AppService, private elRef: ElementRef) {
  }

  /**
   * Event handler for when the route changes so we can ensure we are always at the top of the page.
   */
  public onActivate(): void {
    this.elRef?.nativeElement?.scrollTo(0, 0);
  }

}
