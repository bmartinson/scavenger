import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../services/app.service';

@Component({
  template: ``,
})
export abstract class ScavengerRouteComponent implements OnDestroy, OnInit {

  @HostBinding('style.margin-top.rem') protected marginTop: number;
  private navigationDisplaySubscription: Subscription;

  constructor(public appService: AppService) {
  }

  public ngOnInit(): void {
    this.navigationDisplaySubscription = this.appService.navigation$.subscribe(() => {
      if (this.appService.showNavigation) {
        this.marginTop = 4;
      } else {
        this.marginTop = undefined;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.navigationDisplaySubscription) {
      this.navigationDisplaySubscription.unsubscribe();
      this.navigationDisplaySubscription = null;
    }
  }

}
